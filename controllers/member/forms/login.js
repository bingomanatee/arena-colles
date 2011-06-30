module.exports = {
    fields: [{
        name: 'member[_id]',
        label: 'Alias'
    }, {
        name: 'member[password]',
        label: 'Password',
        type: 'password'
    }, {
        name: 'member[signin]',
        label: '',
        type: 'submit',
        value: 'signin'
    }],
    configs: {
        action: '/members/0/login',
        method: 'POST'
    }
}