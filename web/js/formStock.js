var timerId;

function changeDiscount() {
    getAllocationTypes();
}

function getAllocationTypes() {
    if (timerId) {
        clearInterval(timerId);
    }
    $('#loading').removeClass('hidden');
    timerId = setTimeout(function () {
        var categoryId = $('#stockform-categoryid').val();
        var discount = $('#discount').val();
        $.ajax({
            url: location.href,
            type: "post",
            data: {"categoryId": categoryId, "discount": discount, 'get': 'allocationTypes'},
            success: function (result) {
                $('#loading').addClass('hidden');
                if (result) {
                    var select = $('#stockform-commissiontype');
                    select.empty();
                    for (var key in result) {
                        select.append('<option value="' + key + '" data-value="' + result[key]['value'] + '">' + result[key]['name'] + '</option>');
                    }
                    select.parents('#commissionTypeWrap').removeClass('hidden')
                    select.val('').trigger("chosen:updated");

                } else {
                    var select = $('#stockform-commissiontype');
                    select.parents('#commissionTypeWrap').addClass('hidden');

                }

            }
        });
    }, 500)
}

function getCategoryCover(categoryId) {
    $.ajax({
        url: location.href,
        type: "post",
        data: {"categoryId": categoryId, 'get': 'categoryCovers'},
        success: function (result) {
            var wrap = $('#covers-wrap');
            wrap.children('div.img-item').each(function () {
                $(this).remove();
            });
            // wrap.empty();
            for (var key in result) {
                wrap.prepend('<img src="' + result[key] + '" class="img-thumbnail" onclick="selectCover(this)">');
            }

        }
    });
}

function selectCover(img) {
    $('.img-thumbnail').not(img).removeClass('active');
    $(img).addClass('active');
    $('#stockform-picture').val($(img).attr('src').replace('thumb_', ''));
    $('#stockform-picture').trigger('change');
    $('#stock-cover').attr('src', $(img).attr('src').replace('thumb_', ''));
}

function checkGroup(button) {
    var fields = button.parent().parent().find('.required .form-control');
    for (var i = 0; i < fields.length; i++) {
        if ($(fields[i]).val() == '') {
            return false;
        }
    }

    return true;
}

function isEmpty( el ){
    return !$.trim(el.html())
}

function whichDay(dateString) {
    var daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    return daysOfWeek[dateString.getDay()];
}

function whichMonth(dateString) {
    var months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    return months[dateString.getMonth()];
}

function unValid(el) {
    $(el).closest($('.valid')).removeClass('valid');
}

function countPrice() {
    var discount = $('#discount').val();
    var price = $('#stockform-price').val();
    var save = price*discount/100;
    var new_price = price - save;
    if(new_price.toString().indexOf('.')!=-1){
        if(new_price.toString().split(".")[1].length > 2){
            if( !isNaN( parseFloat( new_price ) ) ) {
                new_price = parseFloat(new_price).toFixed(2);
            }
        }
    }
    if(!isNaN(new_price))
    {
        $('#new_price').text(new_price);
    }
    if(!isNaN(save))
    {
        $('#save').text(save);
    }
}

function countProfit() {
    var commissiontype = $('#stockform-commissiontype');
    var discount = $('#discount').val();
    var price = $('#stockform-price').val();
    var commissionvalue = 0;
    if(commissiontype.val() == 'percent'){
        commissionvalue = commissiontype.find(':selected').data('value');
    }

    var new_price = price - price * discount / 100;
    var profit = new_price - new_price * commissionvalue / 100;

    if(profit.toString().indexOf('.')!=-1){
        if(profit.toString().split(".")[1].length > 2){
            if( !isNaN( parseFloat( profit ) ) ) {
                profit = parseFloat(profit).toFixed(2);
            }
        }
    }
    if(!isNaN(profit)) {
        $('#webmaster_reward').text(profit);
    }
}

function validateEmpty(section){
    var errors = 0;
    section.find($('.field-error')).each(function(){
        $(this).removeClass('field-error');
    });
    section.find($('.form-error-msg')).each(function(){
        $(this).text('');
    });

    section.find($('.required-field')).each(function(){
        var $this = $(this),
            input = $this.find($("[name^='StockForm']"));
        if (!input.val() && input.parent().is(':visible')){
            errors++;
            $this.addClass('field-error');
            $this.find('.form-error-msg').text('Поле является обязательным');
        }

        input = $this.find($("[name^='OrganizerForm']"));
        if (!input.val() && input.parent().is(':visible')){
            errors++;
            $this.addClass('field-error');
            $this.find('.form-error-msg').text('Поле является обязательным');
        }

        input = $this.find($("[name^='LocationForm']"));
        if (!input.val() && input.parent().is(':visible')){
            errors++;
            $this.addClass('field-error');
            $this.find('.form-error-msg').text('Поле является обязательным');
        }
    });
    if (errors > 0){
        section.removeClass('valid');
        return false;
    }

    section.addClass('valid');
    return true;
}

function countDown(){

}

$(document).ready(function () {
    // $('.discount-but').click(changeDiscount);

    var discountInp = $('#discount');
    var categorySelect = $('#stockform-categoryid');
    categorySelect.change(function () {
        if ($(this).val() != '') {
            // discountInp.removeAttr('disabled');
            // discountInp.parent().removeClass('disabled');
            getCategoryCover($(this).val());
        } else {
            // discountInp.parent().addClass('disabled');
            // discountInp.attr('disabled', 'disabled');
            // discountInp.val('');
            $('#commissionTypeWrap').addClass('hidden');
            $('#stockform-commissiontype').val('');
        }
    });

    if (discountInp.val() == '') {
        // discountInp.parent().addClass('disabled');
    } else {
        // discountInp.removeAttr('disabled');
    }

    discountInp.keydown(function () {
        if (event.keyCode < 48 || event.keyCode > 57 && event.keyCode < 96 || event.keyCode > 105) {
            if (event.keyCode == 8) {

            } else {
                event.preventDefault();
            }
        }
    });
    discountInp.change(function () {
        if ($(this).val() == '') {
            $('#commissionTypeWrap').addClass('hidden');
            $('#stockform-commissiontype').val('');
        } else {
            getAllocationTypes();
        }
    });

    $('.step-button').click(function () {
        if ($(this).data('action') == 'next') {
            if (checkGroup($(this))) {
                $('.step-content').slideUp(500);
                $($(this).data('target')).addClass('open').slideDown(500);
                $('.panel').each(function () {
                    $(this).removeClass('active');
                });
                $($(this).data('target')).parent('.panel').addClass('active');

            }
        } else {
            $('.step-content').slideUp(500);
            $($(this).data('target')).addClass('open').slideDown(500);
            $('.panel').each(function () {
                $(this).removeClass('active');
            });
            $($(this).data('target')).parent('.panel').addClass('active');
        }
    });

    $('#add-image').change(function () {
        var form = $('#w0');
        var el = $(this).parents('#covers-wrap').find('.img-item').last();
        var self = this;
        var formData = new FormData(form.get(0));
        formData.append('upload', 1);
        $.ajax({
            url: location.href,
            type: 'POST',
            contentType: false,
            processData: false,
            data: formData,
            success: function (result) {
                $('#stockform-picture').val(result);
                $('.img-thumbnail').removeClass('active');
                var img = '<img src="' + result + '" class="active img-thumbnail" onclick="selectCover(this)">';
                if(isEmpty(el)){
                    el = $(self).parents('#covers-wrap');
                    el.prepend(img);
                }else {
                    el.after(img);
                }

                $('#stockform-picture').val(result.replace('thumb_', ''));
                $('#stock-cover').attr('src', result.replace('thumb_', ''));
            }
        });
    });

    $('#add-logo').change(function () {
        var form = $('#w0');
        var formData = new FormData(form.get(0));
        formData.append('uploadLogo', 1);
        $.ajax({
            url: location.href,
            type: 'POST',
            contentType: false,
            processData: false,
            data: formData,
            success: function (result) {
                $('#logo-wrap').html('<img src="' + result + '" class="img-thumbnail">');
                $('#organizerform-logo').val(result);
            }
        });
    });

    $('#countPerson').change(function () {
        if ($(this).is(':checked')) {
            $('#countPersonWrap').removeClass('hidden');
        } else {
            $('#countPersonWrap').addClass('hidden');
        }
    });

    // $('.form-control').keyup(function (event) {
    $("[name^='StockForm']").keyup(function (event) {
        var target = '#stock' + $(this).attr('id').substr($(this).attr('id').indexOf('-'));
        if (event.keyCode == 8) {
            var str = $(target).text();
            $(target).text(str.substr(0, -1));
        }
        $(target).text($(this).val());
    }).change(function (event) {
        var target = '#stock' + $(this).attr('id').substr($(this).attr('id').indexOf('-'));

        if (event.keyCode == 8) {
            var str = $(target).text();
            $(target).text(str.substr(0, -1));
        }
        $(target).text($(this).val());
    });

    $('#stockform-categoryid').chosen().change(function () {
        getAllocationTypes();
        unValid(this);
    });

    $('#addlocation').click(function () {
        var locationsCount = $(this).parents('#locations').data('locations-count');
        console.log('begin ' + locationsCount);
        var id = locationsCount;
        var addressId = 'address_' + id;

        var newLocation = '<div id="location_' + id + '" class="address-row">';
        newLocation += '<div class="db mtop-50">';
        newLocation += '<h4>Добавить локацию</h4>';
        newLocation += '</div>';
        newLocation += '<input id="address_' + id + '" name="LocationForm[address][]" class="w-100 address" placeholder="ул. Парашютная 12/14 1">';
        newLocation += '<div class="f-0 mtop-20">';
        newLocation += '<div class="dib w-50 f-14">';
        newLocation += '<input class="w-85 city" name="LocationForm[city][]" placeholder="Киев">';
        newLocation += '</div>';
        newLocation += '<div class="dib w-50 f-14 text-right">';
        newLocation += '<input class="w-100 phone" name="LocationForm[phone][]" placeholder="+380 (ХХ) ХХХ-ХХ-ХХ" pattern="/^(\+?38\s?|)(|\()[0-9]{3}(|\))\s?(|\-)[0-9]{3}\s?(|\-)[0-9]{2}\s?(|\-)[0-9]{2}$/">';
        newLocation += '</div>';
        newLocation += '</div>';
        // newLocation += '<div class="text-right">';
        // newLocation += '<button class="btn btn-blue">Отменить</button> ';
        // newLocation += '<button class="btn btn-blue">Сохранить</button>';
        // newLocation += '</div>';
        newLocation += '</div>';

        if($(this).parent().before(newLocation)){
            var newLocationCount = locationsCount + 1;
            $(this).parents('#locations').data('locations-count', newLocationCount);
            var autocomplete_ = new google.maps.places.Autocomplete(
                /** @type {!HTMLInputElement} */(document.getElementById(addressId)),
                {types: ['geocode']});

            // When the user selects an address from the dropdown, populate the address
            // fields in the form.
            autocomplete_.addListener('place_changed', function () {
                codeAddress(addressId);
            });
        }
    });

    $('#stockform-startdate, #stockform-enddate').pickadate({
        min: true,
        today: '',
        clear: '',
        close: '',
        onStart: function() {
            $('.picker__day').each(function () {
                var timestamp = $(this).data('pick');
                var date = new Date(timestamp);
                var day = whichDay(date);
                var month = whichMonth(date);
                $(this).attr('data-month', day);
                $(this).attr('data-day', month);
            });
        },
        onRender: function() {
            $('.picker__day').each(function () {
                var timestamp = $(this).data('pick');
                var date = new Date(timestamp);
                var day = whichDay(date);
                var month = whichMonth(date);
                $(this).attr('data-day', day);
                $(this).attr('data-month', month);
            });
        }
    });

});

$(document).ready(function () {
    var keypressSlider = document.getElementById('precentslider'),
        input = document.getElementById('discount'),
        resultElement = document.getElementsByClassName('current');

    noUiSlider.create(keypressSlider, {
        start: 50,
        step: 1,
        range: {
            'min': 0,
            'max': 100
        },
        format: wNumb({
            decimals: 0
        })
    });

    keypressSlider.noUiSlider.on('update', function( values, handle ) {
        input.value = values[handle];
        $(resultElement).text(values[handle]);
        $('.discount').text(values[handle]);
        countPrice();
        changeDiscount();
        countProfit();
        unValid(resultElement);
    });

    input.addEventListener('change', function(){
        keypressSlider.noUiSlider.set([null, this.value]);
    });

    // Listen to keydown events on the input field.
    input.addEventListener('keydown', function( e ) {

        // Convert the string to a number.
        var value = Number( keypressSlider.noUiSlider.get() ),
            sliderStep = keypressSlider.noUiSlider.steps();

        // Select the stepping for the first handle.
        sliderStep = sliderStep[0];

        // 13 is enter,
        // 38 is key up,
        // 40 is key down.
        switch ( e.which ) {
            case 13:
                keypressSlider.noUiSlider.set(this.value);
                break;
            case 38:
                keypressSlider.noUiSlider.set( value + sliderStep[1] );
                break;
            case 40:
                keypressSlider.noUiSlider.set( value - sliderStep[0] );
                break;
        }
    });


    $("#stockform-price").keyup(function (event) {
        $('.price').text($(this).val());
        countPrice();
        countProfit();
    }).change(function (event) {
        $('.price').text($(this).val());
        countPrice();
        countProfit();
    });

    $('#stockform-commissiontype').chosen().change(function () {
        countProfit();
        unValid(this);
    });

    $(document).on("click", ".js-toggle", function (e) {
        e.preventDefault();
        $($(this).data("toggle")).toggle();
    });

    $(".row .row-title").click(function (e) {
        if($(this).parents('.row').hasClass('valid')) {
            e.preventDefault();
            $(".row.active").removeClass("active");
            $(this).parent().toggleClass("active");
        }
    });

    $(".row .btn-next-step").click(function (e) {
        if($(this).attr('type') != 'submit' ) {
            e.preventDefault();
            if (validateEmpty($(this).parents('.row'))) {
                $(this).parents('.row').addClass('valid');
                $(".row.active").removeClass("active");
                $("html, body").animate({
                    scrollTop: $(this).closest(".row").next().addClass("active").offset().top
                }, 450);
                $("#sidebar").animate({
                    scrollTop: $(this).closest(".row").next().find(".row-title").position().top
                }, 450);
            }
        }
    });

    $('input, textarea').on('keyup change', function(){
        unValid(this);
    });

    $('textarea').each(function () {
        var self = $(this);
        var text_max = self.attr('maxlength') ? self.attr('maxlength') : 255;
        var input = self.siblings('.text');
        input.html(text_max + ' символов осталось');
        self.keyup(function() {
            var x = self.val();
            var newLines = x.match(/(\r\n|\n|\r)/g);
            var addition = 0;
            if (newLines != null) {
                addition = newLines.length;
            }

            var text_length = x.length + addition;

            var text_remaining = text_max - text_length;

            input.html(text_remaining + ' символов осталось');
        });
    })

});
