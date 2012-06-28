var data = {};

function GithubUploader(url, opts) {
    data = opts

    $("#path").change(function() {
        data["path"] = $("#path").val()
        $("#file").fileupload("option", "formData", data)
    })

    $("#file").fileupload({
        url: url,
        formData: data,
        done: function (e, data) {
            $("#filename").html(data.result)
        }
    })
}
