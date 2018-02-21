module.exports = {
    get: function(req, res) {
        view = req.query.view || 'index';
        res.locals.title = "Gestionnaire de Presence";
        res.locals.layout = req.query.layout || "admin/layout";
        return res.view('admin/' + view);
    },
}