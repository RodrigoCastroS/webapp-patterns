const Router = {
    init: () => {
        document.querySelectorAll("a.navlink").forEach(a => {
            a.addEventListener("click", event => {
                event.preventDefault();
                const href = event.target.getAttribute("href");
                Router.go(href);
            });
        });  
        // It listen for history changes
        window.addEventListener('popstate',  event => {
            Router.go(event.state.route, false);
        });
        // Process initial URL   
        Router.go(location.pathname);
    },  
    setMetadata(title, color){
        document.title = `${title}`;
        document.querySelector('meta[name=theme-color]').color = color;

    },  
    go: async (route, addToHistory=true) => {
        if (addToHistory) {
            history.pushState({ route }, '', route);
        }
        let pageElement = null;
        switch (route) {
            case "/":
                pageElement = document.createElement("menu-page");
                Router.setMetadata("Menu", '#43281C');
                break;
            case "/order":
                await import("../components/OrderPage.js");
                pageElement = document.createElement("order-page");
                Router.setMetadata("Orders", 'green');
                break;
            default:
                if (route.startsWith("/product-")) {                
                    pageElement = document.createElement("details-page");
                    pageElement.dataset.productId = route.substring(route.lastIndexOf("-")+1);
                    Router.setMetadata("Menu", 'red');
                }
                break;   
        }
        if (pageElement) {
            // get current page element     
            function changePage() {
                let currentPage = document.querySelector("main").firstElementChild; 
                if (currentPage) {
                    currentPage.remove();
                    document.querySelector("main").appendChild(pageElement);
                } else {
                    document.querySelector("main").appendChild(pageElement);
                }
            }
            if (!document.startViewTransition) {
                changePage()
            } else {
                document.startViewTransition(() => changePage())
            }

        }

        window.scrollX = 0;
    }
}

export default Router;