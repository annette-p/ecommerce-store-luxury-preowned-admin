const forms = require('forms');
// some shortcuts
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

var bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) {
        object.widget.classes = [];
    }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

// createProductForm function and validator
const createProductForm = () => {   // to add into argurment - allCateogries, allTags
    // create a new form
    return forms.create({
        // <input type="text" name="name" class="form-label"/>
        'name':fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'cost':fields.string({
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                'label': ['form-label']
            },
            'validators': [ validators.integer(), validators.min(0)]
        }),
        'description': fields.string({
            'required': true,
            'errorAfterField': true,
            'cssClasses':{
                'label':['form-label']
            }
        }),
        // 'category_id': fields.string({
        //     'label':'Product Category',
        //     'required': true,
        //     'errorAfterField': true,
        //     'cssClasses': {
        //         'label':['form-label']
        //     },
        //     'widget': widgets.select(),
        //     'choices': allCateogries
        // }),
        // 'tags': fields.string({
        //     required: true,
        //     errorAfterField: true,
        //     cssClasses:{
        //         'label':['form-label']
        //     },
        //     widget: widgets.multipleSelect(),
        //     choices: allTags
        // }),
        // 'image_url': fields.string({
        //     widget: widgets.hidden()
        // })
        
    })
}

module.exports = { createProductForm, bootstrapField};