$(document).ready(function() {
    var list = $("#todo-list");
    
    $("#addBtn").click(function() {
        var inp = $("#todo-input").val();
        if (inp) {
            list.append("<li><input type='checkbox'> " + inp + "</li>");
            $("#todo-input").val("");
        }
    });

    list.on('click', 'input[type="checkbox"]', function() {
        $(this).parent().remove();
    });
});