/**
 * FUNCAO PARA EXCUTAR SCRIPTS DE CADA SECAO
 **/

'use strict';

var _base = function(config) {
    config.init = function() {
        var resizeList = [];

        for (var indice in this) {
            if (({}).toString.call(this[indice]).match(/\s([a-z|A-Z]+)/)[1].toLowerCase() === 'function' && (/^_init|_resize/).test(indice)) {
                if ((/^_init/).test(indice)) {
                    this[indice].apply(this, []);
                } else {
                    resizeList.push(this[indice]);
                }
            }
        }

        return resizeList;
    };

    return config;
};

// INICIALIZACAO
var _initScripts = {
    init: function() {
        var sectionID = $('body').attr('data-id');
        var actionID = $('body').attr('data-action');

        scripts.init();

        if (window[sectionID]) {
            var resizeList = window[sectionID].init();

            $(window).resize(function() {
                for (var indice in resizeList) {
                    resizeList[indice].apply(this, []);
                }
            });
        }

        if (window[actionID]) {
            var resizeListAction = window[actionID].init();

            $(window).resize(function() {
                for (var indice in resizeListAction) {
                    resizeListAction[indice].apply(this, []);
                }
            });
        }
    }
};

// FUNCOES PADRAO DO PROJETO
var scripts = _base({
    _initBarraNavegador: function() {
        $('.btfecharBarra').on('click', function(event) {
            $('.erroNavegador').fadeOut(500);
        });
    },
    autoCompletar: function() {
        $('.auto-completar').on('keyup', function() {
            var elem = $(this);
            var valor = elem.val();
            var url = elem.data('url');
            if ((/\d{5}-\d{3}/).test(valor)) {
                $.ajax({
                    'url': url,
                    dataType: 'json',
                    type: 'post',
                    data: {
                        Cep: valor
                    },
                    success: function(json) {
                        if (json.erro === 0) {
                            var estado = $('#' + elem.data('combo-id'));
                            estado.data('id-selecionado', json.endereco.CidadeID);
                            $('option[value="' + json.endereco.Estado + '"]', estado).prop('selected', true);
                            estado.change();
                            $('#' + elem.data('campo-endereco')).val(json.endereco.Logradouro);
                            $('#' + elem.data('campo-bairro')).val(json.endereco.Bairro);
                        } else if (json.erro === 1 && json.mensagem !== undefined) {
                            window.alert(json.mensagem);
                        }
                    },
                    error: function() {

                    }
                });
            }
        });
    },
    autoCarregar: function() {
        $('.auto-carregar').change(function() {
            var elem = $(this);
            var combo = $('#' + elem.data('id'));
            var comboValor = elem.data('valor');
            var comboLabel = elem.data('label');
            var url = elem.data('url');
            var id = $('option:selected', elem).val();

            if (id !== '') {
                combo.html('<option value="">Carregando...</option>');
                combo.change();
                $.ajax({
                    url: window.BASE_URL + url + id,
                    dataType: 'json',
                    success: function(json) {
                        var html = '<option value="">Selecione</option>';
                        if (json.erro === 0) {
                            var colecao = json.colecao;
                            for (var indice in colecao) {
                                html += '<option value="' + colecao[indice][comboValor] + '">' + colecao[indice][comboLabel] + '</option>';
                            }
                        } else if (json.erro === 1) {
                            window.alert(json.mensagem);
                        }
                        combo.html(html);
                        var selecionado = elem.data('id-selecionado');
                        if (selecionado !== undefined && selecionado !== '') {
                            $('option[value="' + selecionado + '"]', combo).prop('selected', true);
                            combo.change();
                            elem.data('id-selecionado', '');
                        } else {
                            combo.change();
                        }
                    },
                    error: function() {
                        combo.html('<option value="">Selecione</option>');
                        combo.change();
                    }
                });
            }
        });
    },
    docCookies: {
        getItem: function(sKey) {
            return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
        },
        setItem: function(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
            if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
                return false;
            }
            var sExpires = '';
            if (vEnd) {
                switch (vEnd.constructor) {
                    case Number:
                        sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + vEnd;
                        break;
                    case String:
                        sExpires = '; expires=' + vEnd;
                        break;
                    case Date:
                        sExpires = '; expires=' + vEnd.toUTCString();
                        break;
                }
            }
            document.cookie = encodeURIComponent(sKey) + '=' + encodeURIComponent(sValue) + sExpires + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '') + (bSecure ? '; secure' : '');
            return true;
        },
        removeItem: function(sKey, sPath, sDomain) {
            if (!sKey || !this.hasItem(sKey)) {
                return false;
            }
            document.cookie = encodeURIComponent(sKey) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '');
            return true;
        },
        hasItem: function(sKey) {
            return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(document.cookie);
        },
        keys: /* optional method: you can safely remove it! */ function() {
            var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:\=[^;]*)?;\s*/);
            for (var nIdx = 0; nIdx < aKeys.length; nIdx++) {
                aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
            }
            return aKeys;
        }
    }
});



(function() {
    window.validityMessages = [];
    window.validityMessages["pt-br"] = {
        "typeMismatch": {
            "defaultMessage": "Por favor informe um valor válido.",
            "email": "Por favor escreva um endereço de e-mail.",
            "url": "Por favor escreva o URL corretamente."
        },
        "badInput": {
            "defaultMessage": "Valor inválido.",
            "number": "Valor inválido.",
            "range": "Valor inválido."
        },
        "valueMissing": {
            "defaultMessage": "Por favor preencha este campo.",
            "checkbox": "Por favor selecione esta caixa se deseja continuar.",
            "select": "Por favor selecione um item da lista.",
            "radio": "Por favor selecione uma das opções."
        },
        "tooLong": "Valor inválido.",
        "patternMismatch": "Por favor preencha no formato pedido: {%title}.",
        "rangeUnderflow": "O valor tem de ser superior ou igual a {%min}.",
        "rangeOverflow": "O valor tem de ser inferior ou igual a {%max}.",
        "stepMismatch": "Valor inválido."
    };
    window.validityMessages["en"] = {
        "typeMismatch": {
            "defaultMessage": "Please enter a valid value.",
            "email": "Please enter an email address.",
            "url": "Please enter a URL."
        },
        "badInput": {
            "defaultMessage": "Please enter a valid value.",
            "number": "Please enter a number.",
            "range": "Invalid input."
        },
        "valueMissing": {
            "defaultMessage": "Please fill out this field.",
            "checkbox": "Please check this box if you want to proceed.",
            "select": "Please select an option.",
            "radio": "Please select an option."
        },
        "stepMismatch": "Invalid input.",
        "tooLong": "Invalid input.",
        "patternMismatch": "Invalid input. {%title}",
        "rangeUnderflow": "Value must be greater than or equal to {%min}.",
        "rangeOverflow": "Value must be less than or equal to {%max}."
    };
    window.validityMessages["es"] = {
        "typeMismatch": {
            "defaultMessage": "Por favor, introduzca un valor v\xe1lido.",
            "email": "Por favor, introduzca una direcci\xf3n de correo.",
            "url": "Por favor, introduzca una URL."
        },
        "badInput": {
            "defaultMessage": "Valor no v\xe1lido",
            "number": "Valor no v\xe1lido",
            "range": "Valor no v\xe1lido"
        },
        "valueMissing": {
            "defaultMessage": "Por favor, rellene este campo.",
            "checkbox": "Por favor, marque esta casilla si desea continuar.",
            "select": "Por favor, seleccione un elemento de la lista.",
            "radio": "Por favor, seleccione una de estas opciones."
        },
        "tooLong": "Valor no v\xe1lido",
        "patternMismatch": "Por favor, aj\xfastese al formato solicitado: {%title}.",
        "rangeUnderflow": "El valor debe superior o igual a {%min}.",
        "rangeOverflow": "El valor debe inferior o igual a {%max}.",
        "stepMismatch": "Valor no v\xe1lido"
    };

    window.formValidation = {
        lang: "pt-br",
        elements: [],
        validations: [],

        addCustomValidityRule: function(selector, validation, message) {
            formValidation.validations[selector] = {
                "customValidation": validation,
                "customMessage": message || null
            };

            var element = $(selector);
            if (element.length > 0) {
                $("body").on("blur", selector, function(evt) {
                    for (var index in formValidation.validations) {
                        var elements = $(index);
                        var count = elements.length;
                        for (var idx = 0; idx < count; idx++) {
                            if (this == elements.get(idx)) {
                                if (!formValidation.validations[index].customValidation(this, this.value)) {
                                    this.setCustomValidity(formValidation.validations[index].customMessage == null ? $(this).data("message") : formValidation.validations[index].customMessage);
                                }
                            }
                        }
                    }
                });
            }
        },

        defaultValidation: function(el) {
            $(el).on("invalid", function() {
                if (this.validity.valueMissing) {
                    if (this.tagName.toLowerCase() == 'select') {
                        this.setCustomValidity(validityMessages[formValidation.lang].valueMissing.select);
                    } else if (this.type && this.type == 'radio') {
                        this.setCustomValidity(validityMessages[formValidation.lang].valueMissing.radio);
                    } else if (this.type && this.type == 'checkbox') {
                        this.setCustomValidity(validityMessages[formValidation.lang].valueMissing.checkbox);
                    } else {
                        this.setCustomValidity(validityMessages[formValidation.lang].valueMissing.defaultMessage);
                    }
                } else if (this.validity.typeMismatch) {
                    if (this.type && this.type == 'email') {
                        this.setCustomValidity(validityMessages[formValidation.lang].typeMismatch.email);
                    } else if (this.type && this.type == 'url') {
                        this.setCustomValidity(validityMessages[formValidation.lang].typeMismatch.url);
                    } else {
                        this.setCustomValidity(validityMessages[formValidation.lang].typeMismatch.defaultMessage);
                    }
                } else if (this.validity.badInput) {
                    if (this.type && this.type == 'number') {
                        this.setCustomValidity(validityMessages[formValidation.lang].badInput.number);
                    } else if (this.type && this.type == 'range') {
                        this.setCustomValidity(validityMessages[formValidation.lang].badInput.range);
                    } else {
                        this.setCustomValidity(validityMessages[formValidation.lang].badInput.defaultMessage);
                    }
                } else if (this.validity.tooLong) {
                    this.setCustomValidity(validityMessages[formValidation.lang].tooLong);
                } else if (this.validity.patternMismatch) {
                    this.setCustomValidity(validityMessages[formValidation.lang].patternMismatch.replace('{%title}', this.title));
                } else if (this.validity.rangeUnderflow) {
                    this.setCustomValidity(validityMessages[formValidation.lang].rangeUnderflow.replace('{%min}', this.min));
                } else if (this.validity.rangeOverflow) {
                    this.setCustomValidity(validityMessages[formValidation.lang].rangeOverflow.replace('{%max}', this.max));
                } else if (this.validity.stepMismatch) {
                    this.setCustomValidity(validityMessages[formValidation.lang].stepMismatch);
                }
            });

            formValidation.elements.push(el);
        },

        removeValidation: function(el) {
            if (el.tagName.toLowerCase() == 'select' ||
                (el.type && (el.type == 'radio' || el.type == 'checkbox'))) {
                $(el).on("change", function(evt) {
                    el.setCustomValidity('');
                });
            } else {
                $(el).on("input", function(evt) {
                    el.setCustomValidity('');
                });
            }
        },

        applyValidate: function() {
            $('input, select, textarea').not("[type=hidden]").each(function() {
                if ($.inArray(this, formValidation.elements) === -1 && this.willValidate) {
                    formValidation.defaultValidation(this);
                    formValidation.removeValidation(this);
                }
            });
        }
    };
})();



var component = _base({


});


$(document).ready(function($) {
    window.BASE_URL = $('link[rel="canonical"]').attr('href');

    _initScripts.init();
});