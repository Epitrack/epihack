/**
 * Created by guinetik on 6/13/15.
 */
$(document).ready(function () {
    $('.filterable .btn-filter').click(function () {
        var $panel = $(this).parents('.filterable'),
            $filters = $panel.find('.filters input'),
            $tbody = $panel.find('.table tbody');
        if ($filters.prop('disabled') == true) {
            $filters.prop('disabled', false);
            $filters.first().focus();
        } else {
            $filters.val('').prop('disabled', true);
            $tbody.find('.no-result').remove();
            $tbody.find('tr').show();
        }
    });

    $("ul.symptoms_list").sortable({group:'symptoms'});
    $("ul.disease_symptoms").sortable({group:'symptoms'});

    $.each(locales, function (key, value) {
        $('#locale_list')
            .append($("<option></option>")
                .attr("value", value)
                .text(value));
    });

    $('#save_disease_symptoms').click(function(){
        var k = $('.disease_symptoms').sortable("serialize")[0];
        var symptoms = [];
        for(var i = 0;i< k.length;i++){
            symptoms.push(k[i].id);
        }
        var s = symptoms.join(",");
        var o = $('#disease_id').val();
        var p = {
            symptoms:s,
            disease_id:o,
            client:'api'
        };
        $.ajax('/diseases/symptoms', {
            data:p,
            method:'post',
            success:function(d){
                console.log('d',d);
                window.location.reload();
            }
        });
    });

    if ($('#locale_list') != null) {
        var v = $('#app_language').val();
        $("#locale_list").val(v).attr("selected", "selected");
    }

    $('#ill_date').datepicker({
        format: "yyyy-mm-dd",
        autoclose: true
    });

    $('#survey_form').submit(function (e) {
        var symptoms = [];
        var survey = $('#survey_form').serializeArray();
        survey.forEach(function (item) {
            if (item.name.indexOf("symptom_") >= 0) {
                symptoms.push(item.value);
            }
        });
        symptoms = symptoms.join(',');
        console.log('survey', survey);
        console.log('symptoms', symptoms);
        $('#survey_symptoms').val(symptoms);
        $('.item_symptom').remove();
        survey = $('#survey_form').serializeArray();
        console.log('survey', survey);
    });

    $('#pickerModal').on('shown.bs.modal', function (e) {
        $('#map_container').locationpicker({
            zoom: 2,
            location:{
                latitude:-14.235004,
                longitude:-51.92528
            },
            inputBinding: {
                latitudeInput: $('#app_latitude'),
                longitudeInput: $('#app_longitude'),
                locationNameInput: $('#app_location')
            }
        });
        $('#map_container').locationpicker('autosize');
    });

    var myDate = new Date();
    var year = myDate.getFullYear();
    for(var i = 1900; i < year+1; i++){
        $('#user_dob_year').append('<option value="'+i+'">'+i+'</option>');
    }

    if(page=='user_edit') {
        $('#user_dob_month').val(dob_month);
        $('#user_dob_year').val(dob_year);
    }

    $('.filterable .filters input').keyup(function (e) {
        /* Ignore tab key */
        var code = e.keyCode || e.which;
        if (code == '9') return;
        /* Useful DOM data and selectors */
        var $input = $(this),
            inputContent = $input.val().toLowerCase(),
            $panel = $input.parents('.filterable'),
            column = $panel.find('.filters th').index($input.parents('th')),
            $table = $panel.find('.table'),
            $rows = $table.find('tbody tr');
        /* Dirtiest filter function ever ;) */
        var $filteredRows = $rows.filter(function () {
            var value = $(this).find('td').eq(column).text().toLowerCase();
            return value.indexOf(inputContent) === -1;
        });
        /* Clean previous no-result if exist */
        $table.find('tbody .no-result').remove();
        /* Show all rows, hide filtered ones (never do that outside of a demo ! xD) */
        $rows.show();
        $filteredRows.hide();
        /* Prepend no-result row if all rows are filtered */
        if ($filteredRows.length === $rows.length) {
            $table.find('tbody').prepend($('<tr class="no-result text-center"><td colspan="' + $table.find('.filters th').length + '">No result found</td></tr>'));
        }
    });
});
var hash = function (s) {
    var n;
    if (typeof(s) == 'number' && s === parseInt(s, 10)) {
        s = Array(s + 1).join('x');
    }
    return s.replace(/x/g, function () {
        var n = Math.round(Math.random() * 61) + 48;
        n = n > 57 ? (n + 7 > 90 ? n + 13 : n + 7) : n;
        return String.fromCharCode(n);
    });
};
$("#generate_token_hash").click(function (e) {
    var h = hash('xxxx-xx-xxxx-xx');
    $("#app_token").val(h);
});
$("#generate_secret_hash").click(function (e) {
    var h = hash('xxxxx-xxx-xxx-xxxxx');
    $("#app_secret").val(h);
});

var locales = [
    "af",
    "af-NA",
    "af-ZA",
    "agq",
    "agq-CM",
    "ak",
    "ak-GH",
    "am",
    "am-ET",
    "ar",
    "ar-001",
    "ar-AE",
    "ar-BH",
    "ar-DZ",
    "ar-EG",
    "ar-IQ",
    "ar-JO",
    "ar-KW",
    "ar-LB",
    "ar-LY",
    "ar-MA",
    "ar-OM",
    "ar-QA",
    "ar-SA",
    "ar-SD",
    "ar-SY",
    "ar-TN",
    "ar-YE",
    "as",
    "as-IN",
    "asa",
    "asa-TZ",
    "az",
    "az-Cyrl",
    "az-Cyrl-AZ",
    "az-Latn",
    "az-Latn-AZ",
    "bas",
    "bas-CM",
    "be",
    "be-BY",
    "bem",
    "bem-ZM",
    "bez",
    "bez-TZ",
    "bg",
    "bg-BG",
    "bm",
    "bm-ML",
    "bn",
    "bn-BD",
    "bn-IN",
    "bo",
    "bo-CN",
    "bo-IN",
    "br",
    "br-FR",
    "brx",
    "brx-IN",
    "bs",
    "bs-BA",
    "ca",
    "ca-ES",
    "cgg",
    "cgg-UG",
    "chr",
    "chr-US",
    "cs",
    "cs-CZ",
    "cy",
    "cy-GB",
    "da",
    "da-DK",
    "dav",
    "dav-KE",
    "de",
    "de-AT",
    "de-BE",
    "de-CH",
    "de-DE",
    "de-LI",
    "de-LU",
    "dje",
    "dje-NE",
    "dua",
    "dua-CM",
    "dyo",
    "dyo-SN",
    "ebu",
    "ebu-KE",
    "ee",
    "ee-GH",
    "ee-TG",
    "el",
    "el-CY",
    "el-GR",
    "en",
    "en-AS",
    "en-AU",
    "en-BB",
    "en-BE",
    "en-BM",
    "en-BW",
    "en-BZ",
    "en-CA",
    "en-GB",
    "en-GU",
    "en-GY",
    "en-HK",
    "en-IE",
    "en-IN",
    "en-JM",
    "en-MH",
    "en-MP",
    "en-MT",
    "en-MU",
    "en-NA",
    "en-NZ",
    "en-PH",
    "en-PK",
    "en-SG",
    "en-TT",
    "en-UM",
    "en-US",
    "en-US-POSIX",
    "en-VI",
    "en-ZA",
    "en-ZW",
    "eo",
    "es",
    "es-419",
    "es-AR",
    "es-BO",
    "es-CL",
    "es-CO",
    "es-CR",
    "es-DO",
    "es-EC",
    "es-ES",
    "es-GQ",
    "es-GT",
    "es-HN",
    "es-MX",
    "es-NI",
    "es-PA",
    "es-PE",
    "es-PR",
    "es-PY",
    "es-SV",
    "es-US",
    "es-UY",
    "es-VE",
    "et",
    "et-EE",
    "eu",
    "eu-ES",
    "ewo",
    "ewo-CM",
    "fa",
    "fa-AF",
    "fa-IR",
    "ff",
    "ff-SN",
    "fi",
    "fi-FI",
    "fil",
    "fil-PH",
    "fo",
    "fo-FO",
    "fr",
    "fr-BE",
    "fr-BF",
    "fr-BI",
    "fr-BJ",
    "fr-BL",
    "fr-CA",
    "fr-CD",
    "fr-CF",
    "fr-CG",
    "fr-CH",
    "fr-CI",
    "fr-CM",
    "fr-DJ",
    "fr-FR",
    "fr-GA",
    "fr-GF",
    "fr-GN",
    "fr-GP",
    "fr-GQ",
    "fr-KM",
    "fr-LU",
    "fr-MC",
    "fr-MF",
    "fr-MG",
    "fr-ML",
    "fr-MQ",
    "fr-NE",
    "fr-RE",
    "fr-RW",
    "fr-SN",
    "fr-TD",
    "fr-TG",
    "fr-YT",
    "ga",
    "ga-IE",
    "gl",
    "gl-ES",
    "gsw",
    "gsw-CH",
    "gu",
    "gu-IN",
    "guz",
    "guz-KE",
    "gv",
    "gv-GB",
    "ha",
    "ha-Latn",
    "ha-Latn-GH",
    "ha-Latn-NE",
    "ha-Latn-NG",
    "haw",
    "haw-US",
    "he",
    "he-IL",
    "hi",
    "hi-IN",
    "hr",
    "hr-HR",
    "hu",
    "hu-HU",
    "hy",
    "hy-AM",
    "id",
    "id-ID",
    "ig",
    "ig-NG",
    "ii",
    "ii-CN",
    "is",
    "is-IS",
    "it",
    "it-CH",
    "it-IT",
    "ja",
    "ja-JP",
    "jmc",
    "jmc-TZ",
    "ka",
    "ka-GE",
    "kab",
    "kab-DZ",
    "kam",
    "kam-KE",
    "kde",
    "kde-TZ",
    "kea",
    "kea-CV",
    "khq",
    "khq-ML",
    "ki",
    "ki-KE",
    "kk",
    "kk-Cyrl",
    "kk-Cyrl-KZ",
    "kl",
    "kl-GL",
    "kln",
    "kln-KE",
    "km",
    "km-KH",
    "kn",
    "kn-IN",
    "ko",
    "ko-KR",
    "kok",
    "kok-IN",
    "ksb",
    "ksb-TZ",
    "ksf",
    "ksf-CM",
    "kw",
    "kw-GB",
    "lag",
    "lag-TZ",
    "lg",
    "lg-UG",
    "ln",
    "ln-CD",
    "ln-CG",
    "lt",
    "lt-LT",
    "lu",
    "lu-CD",
    "luo",
    "luo-KE",
    "luy",
    "luy-KE",
    "lv",
    "lv-LV",
    "mas",
    "mas-KE",
    "mas-TZ",
    "mer",
    "mer-KE",
    "mfe",
    "mfe-MU",
    "mg",
    "mg-MG",
    "mgh",
    "mgh-MZ",
    "mk",
    "mk-MK",
    "ml",
    "ml-IN",
    "mr",
    "mr-IN",
    "ms",
    "ms-BN",
    "ms-MY",
    "mt",
    "mt-MT",
    "mua",
    "mua-CM",
    "my",
    "my-MM",
    "naq",
    "naq-NA",
    "nb",
    "nb-NO",
    "nd",
    "nd-ZW",
    "ne",
    "ne-IN",
    "ne-NP",
    "nl",
    "nl-AW",
    "nl-BE",
    "nl-CW",
    "nl-NL",
    "nl-SX",
    "nmg",
    "nmg-CM",
    "nn",
    "nn-NO",
    "nus",
    "nus-SD",
    "nyn",
    "nyn-UG",
    "om",
    "om-ET",
    "om-KE",
    "or",
    "or-IN",
    "pa",
    "pa-Arab",
    "pa-Arab-PK",
    "pa-Guru",
    "pa-Guru-IN",
    "pl",
    "pl-PL",
    "ps",
    "ps-AF",
    "pt",
    "pt-AO",
    "pt-BR",
    "pt-GW",
    "pt-MZ",
    "pt-PT",
    "pt-ST",
    "rm",
    "rm-CH",
    "rn",
    "rn-BI",
    "ro",
    "ro-MD",
    "ro-RO",
    "rof",
    "rof-TZ",
    "ru",
    "ru-MD",
    "ru-RU",
    "ru-UA",
    "rw",
    "rw-RW",
    "rwk",
    "rwk-TZ",
    "saq",
    "saq-KE",
    "sbp",
    "sbp-TZ",
    "seh",
    "seh-MZ",
    "ses",
    "ses-ML",
    "sg",
    "sg-CF",
    "shi",
    "shi-Latn",
    "shi-Latn-MA",
    "shi-Tfng",
    "shi-Tfng-MA",
    "si",
    "si-LK",
    "sk",
    "sk-SK",
    "sl",
    "sl-SI",
    "sn",
    "sn-ZW",
    "so",
    "so-DJ",
    "so-ET",
    "so-KE",
    "so-SO",
    "sq",
    "sq-AL",
    "sr",
    "sr-Cyrl",
    "sr-Cyrl-BA",
    "sr-Cyrl-ME",
    "sr-Cyrl-RS",
    "sr-Latn",
    "sr-Latn-BA",
    "sr-Latn-ME",
    "sr-Latn-RS",
    "sv",
    "sv-FI",
    "sv-SE",
    "sw",
    "sw-KE",
    "sw-TZ",
    "swc",
    "swc-CD",
    "ta",
    "ta-IN",
    "ta-LK",
    "te",
    "te-IN",
    "teo",
    "teo-KE",
    "teo-UG",
    "th",
    "th-TH",
    "ti",
    "ti-ER",
    "ti-ET",
    "to",
    "to-TO",
    "tr",
    "tr-TR",
    "twq",
    "twq-NE",
    "tzm",
    "tzm-Latn",
    "tzm-Latn-MA",
    "uk",
    "uk-UA",
    "ur",
    "ur-IN",
    "ur-PK",
    "uz",
    "uz-Arab",
    "uz-Arab-AF",
    "uz-Cyrl",
    "uz-Cyrl-UZ",
    "uz-Latn",
    "uz-Latn-UZ",
    "vai",
    "vai-Latn",
    "vai-Latn-LR",
    "vai-Vaii",
    "vai-Vaii-LR",
    "vi",
    "vi-VN",
    "vun",
    "vun-TZ",
    "xog",
    "xog-UG",
    "yav",
    "yav-CM",
    "yo",
    "yo-NG",
    "zh",
    "zh-Hans",
    "zh-Hans-CN",
    "zh-Hans-HK",
    "zh-Hans-MO",
    "zh-Hans-SG",
    "zh-Hant",
    "zh-Hant-HK",
    "zh-Hant-MO",
    "zh-Hant-TW",
    "zu",
    "zu-ZA"
];
