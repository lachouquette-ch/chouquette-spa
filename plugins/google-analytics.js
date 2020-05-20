/* eslint-disable */

export default ({ app }) => {
    // Only client side and in production mode
    if (process.env.NODE_ENV !== 'production') return
    // Include Google Analytics
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    // Change current page
    ga('create', 'UA-47894326-1', 'auto')
    // On any route change
    app.router.afterEach((to, from) => {
        // Add a new page view to Google Analytics
        ga('set', 'page', to.fullPath)
        ga('send', 'pageview')
    })
}