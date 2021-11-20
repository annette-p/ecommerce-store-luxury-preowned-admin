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
        'designer':fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'name':fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'price':fields.string({
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                'label': ['form-label']
            },
            'validators': [ validators.integer(), validators.min(0)]
        }),
        'retail price':fields.string({
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                'label': ['form-label']
            },
            'validators': [ validators.integer(), validators.min(0)]
        }),
        'stock unit':fields.string({
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                'label': ['form-label']
            },
            'validators': [ validators.integer(), validators.min(0)]
        }),
        'insurance':fields.string({   // to be boolean (yes/no)
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'authenticity':fields.string({  // to be boolean (yes/no)
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        // 'tags': fields.string({ // by default will set to "just in", but able to have multi-select for other tag
        //     required: true,
        //     errorAfterField: true,
        //     cssClasses:{
        //         'label':['form-label']
        //     },
        //     widget: widgets.multipleSelect(),
        //     choices: allTags
        // }),
        // 'category_id': fields.string({  // drop-down list, can only choose 1 choice frm the list
        //     'label':'Product Category',
        //     'required': true,
        //     'errorAfterField': true,
        //     'cssClasses': {
        //         'label':['form-label']
        //     },
        //     'widget': widgets.select(),
        //     'choices': allCateogries
        // }),
        // 'condition_id': fields.string({  // drop-down list, can only choose 1 choice frm the list
        //     'label':'Condition',
        //     'required': true,
        //     'errorAfterField': true,
        //     'cssClasses': {
        //         'label':['form-label']
        //     },
        //     'widget': widgets.select(),
        //     'choices': allConditions
        // }),
        'condition description': fields.string({  
            'required': true,
            'errorAfterField': true,
            'cssClasses':{
                'label':['form-label']
            }
        }),
        'product description': fields.string({  
            'required': true,
            'errorAfterField': true,
            'cssClasses':{
                'label':['form-label']
            }
        }),
        'product specification': fields.string({  
            'required': true,
            'errorAfterField': true,
            'cssClasses':{
                'label':['form-label']
            }
        }),
        'consignment':fields.string({   // to be boolean (yes/no)
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'consignment ID':fields.string({   // How to auto-populated frm consignment table
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        // 'image_url': fields.string({
        //     widget: widgets.hidden()
        // })
        
    })
}


const createNewAdminForm = ()=>{
    return forms.create({
        'first name': fields.string({
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                'label': ['form-label']
            }
        }),
        'last name': fields.string({
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                'label': ['form-label']
            }
        }),
        'email': fields.string({
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                'label': ['form-label']
            }
        }),
        'username': fields.string({
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                'label': ['form-label']
            }
        }),
        'password': fields.string({
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                'label': ['form-label']
            },
            'widget': widgets.password()
        }),
        'confirm_password': fields.string({
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                'label':['form-label']
            },
            'widget': widgets.password(),
            'validators': [validators.matchField('password')]
        })
    })
}

const createAdminLoginForm = () => {
    return forms.create({
        'username': fields.string({
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                'label': ['form-label']
            }
        }),
        'password': fields.string({
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                'label': ['form-label']
            },
            'widget': widgets.password()
        })
    })
}

module.exports = { createProductForm, bootstrapField, createNewAdminForm, createAdminLoginForm };