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
const createProductForm = (allCategories, allDesigners, allTags) => {   // to add into argurment - allCateogries, allTags
    // create a new form
    return forms.create({
        // <input type="text" name="name" class="form-label"/>
        'designer_id': fields.string({  // drop-down list, can only choose 1 choice frm the list
            'label':'Designer',
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                'label':['form-label']
            },
            'widget': widgets.select(),
            'choices': allDesigners
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
        'retailPrice':fields.string({
            'label': 'Retail Price',
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                'label': ['form-label']
            },
            'validators': [ validators.integer(), validators.min(0)]
        }),
        'stockUnit':fields.string({
            'label': 'Stock Unit',
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
        'tags': fields.string({ // by default will set to "just in", but able to have multi-select for other tag
            required: true,
            errorAfterField: true,
            cssClasses:{
                'label':['form-label']
            },
            widget: widgets.multipleSelect(),
            choices: allTags
        }),
        'category_id': fields.string({  // drop-down list, can only choose 1 choice frm the list
            'label':'Product Category',
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                'label':['form-label']
            },
            'widget': widgets.select(),
            'choices': allCategories
        }),
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
        'condition_description': fields.string({  
            'label': 'Condition Description',
            'required': true,
            'errorAfterField': true,
            'cssClasses':{
                'label':['form-label']
            }
        }),
        'product_description': fields.string({  
            'label': 'Product Description',
            'required': true,
            'errorAfterField': true,
            'cssClasses':{
                'label':['form-label']
            }
        }),
        'product_specification': fields.string({  
            'label': 'Product Specification',
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
        'consignment_id':fields.string({   // How to auto-populated frm consignment table
            'label': 'Consignment ID',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        // 'image_url': fields.string({
        //    'label': 'Image URL',
        //     widget: widgets.hidden()
        // })
        
    })
}


const createNewAdminForm = ()=>{
    return forms.create({
        'firstname': fields.string({
            'label': 'First Name',
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                'label': ['form-label']
            }
        }),
        'lastname': fields.string({
            'label': 'Last Name',
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
        'confirmPassword': fields.string({
            'label': 'Confirm Password',
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

// login form at the home page
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

// current logged in admin user in setting page
const displayAdminProfileForm = ()=>{    // to fatch current email from user profile table in db
    return forms.create({
        'firstname': fields.string({
            'label': 'First Name',
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                'label': ['form-label']
            }
        }),
        'lastname': fields.string({
            'label': 'Last Name',
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
        })
    })
}

// current logged in admin user change his/her own password in setting page
const createChangePasswordForm = () => {
    return forms.create({
        'currentPassword': fields.string({
            'label': 'Current Password',
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                'label': ['form-label']
            },
            'widget': widgets.password()
        }),
        'newPassword': fields.string({
            'label': 'New Password',
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                'label': ['form-label']
            },
            'widget': widgets.password(),
            'validators': [
                validators.minlength(6), 
                validators.alphanumeric()
            ]
        }),
        'newPassword2': fields.string({
            'label': 'Re-enter New Password',
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                'label': ['form-label']
            },
            'widget': widgets.password(),
            'validators': [validators.matchField('newPassword', 'Does not match "New Password"')]
        })
    }, {
        validatePastFirstError: true
    })
}


module.exports = { createProductForm, bootstrapField, createNewAdminForm, createAdminLoginForm, createChangePasswordForm, displayAdminProfileForm };