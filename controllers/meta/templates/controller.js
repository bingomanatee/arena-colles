/**
 *  CONTROLLER <%- name.toUpperCase() %>
 * <%- description %>
 */
module.exports = {
<% actions.forEach(function(action){ %>
    <%- action %>: require('mvc/actions/<%- action %>'),
<% }) %>
<% if (forms) { %>
    forms: <%- JSON.stringify(forms, null, 2) %>
    <% } %>
};