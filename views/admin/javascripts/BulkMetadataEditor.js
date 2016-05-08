jQuery(document).ready(function () {
    var $ = jQuery;
    var language = Omeka.BulkMetadataEditor.language;
    var url = document.URL.split('?')[0];

    init();

    function init() {
        $('#changesRadio-replace-field').after($('#bulk-metadata-editor-replace-field'));
        $('#changesRadio-replace-field').after($('#regexp-field'));
        $('#changesRadio-replace-field').after($('#bulk-metadata-editor-search-field'));
        $('#changesRadio-add-field').after($('#bulk-metadata-editor-add-field'));
        $('#changesRadio-append-field').after($('#bulk-metadata-editor-append-field'));
        $('#changesRadio-deduplicate-field').after($('#bulk-metadata-editor-deduplicate-field'));
        $('#changesRadio-deduplicate-files-field').after($('#bulk-metadata-editor-deduplicate-files-field'));

        $('#preview-items-button').wrap('<div class="previewButtonDiv"></div>');
        $('#preview-fields-button').wrap('<div class="previewButtonDiv"></div>');
        $('#preview-changes-button').wrap('<div class="previewButtonDiv"></div>');

        $('#preview-items-button').after('<div class="bulk-metadata-editor-waiting" id="items-waiting">' + language.PleaseWait + '</div>');
        $('#preview-fields-button').after('<div class="bulk-metadata-editor-waiting" id="fields-waiting">' + language.PleaseWait + '</div>');
        $('#preview-changes-button').after('<div class="bulk-metadata-editor-waiting" id="changes-waiting">' + language.PleaseWait + '</div>');

        $('#preview-items-button').after($('#hide-item-preview'));
        $('#preview-fields-button').after($('#hide-field-preview'));
        $('#preview-changes-button').after($('#hide-changes-preview'));

        $('.bulk-metadata-editor-selector').keypress(function (event) {
            var key = event.which;
            // the enter key code
            if (key == 13) {
                event.preventDefault();
            }
        });

        $('#item-select-meta').change(function () {
            if (this.checked) {
                $('#item-meta-selects').show();
            } else {
                $('#item-meta-selects').hide();
            }
        });

        $('#add-rule').on('click', function (event) {
            event.preventDefault();
            var currentLast = $('.item-rule-box:last');
            var newLast = currentLast.clone(true);
            newLast.find('#bulk-metadata-editor-element-id').val('50');
            newLast.find('#bulk-metadata-editor-compare').val('exact');
            newLast.find('#bulk-metadata-editor-selector').val('');
            newLast.find('#bulk-metadata-editor-case').attr('checked', false);
            currentLast.parent().append(newLast);
        });

        $('#changesRadio-replace').change(function () {
            if (this.checked) {
                $('#bulk-metadata-editor-search-field').show(300);
                $('#bulk-metadata-editor-replace-field').show(300);
                $('#regexp-field').show(300);
                $('#bulk-metadata-editor-add-field').hide(300);
                $('#bulk-metadata-editor-append-field').hide(300);
                $('#bulk-metadata-editor-deduplicate-field').hide(300);
                $('#bulk-metadata-editor-deduplicate-files-field').hide(300);
            }
        });

        $('#changesRadio-add').change(function () {
            if (this.checked) {
                $('#bulk-metadata-editor-search-field').hide(300);
                $('#bulk-metadata-editor-replace-field').hide(300);
                $('#regexp-field').hide(300);
                $('#bulk-metadata-editor-add-field').show(300);
                $('#bulk-metadata-editor-append-field').hide(300);
                $('#bulk-metadata-editor-deduplicate-field').hide(300);
                $('#bulk-metadata-editor-deduplicate-files-field').hide(300);
            }
        });

        $('#changesRadio-append').change(function () {
            if (this.checked) {
                $('#bulk-metadata-editor-search-field').hide(300);
                $('#bulk-metadata-editor-replace-field').hide(300);
                $('#regexp-field').hide(300);
                $('#bulk-metadata-editor-add-field').hide(300);
                $('#bulk-metadata-editor-append-field').show(300);
                $('#bulk-metadata-editor-deduplicate-field').hide(300);
                $('#bulk-metadata-editor-deduplicate-files-field').hide(300);
            }
        });

        $('#changesRadio-deduplicate').change(function () {
            if (this.checked) {
                $('#bulk-metadata-editor-search-field').hide(300);
                $('#bulk-metadata-editor-replace-field').hide(300);
                $('#regexp-field').hide(300);
                $('#bulk-metadata-editor-add-field').hide(300);
                $('#bulk-metadata-editor-append-field').hide(300);
                $('#bulk-metadata-editor-deduplicate-field').show(300);
                $('#bulk-metadata-editor-deduplicate-files-field').hide(300);
            }
        });

        $('#changesRadio-deduplicate-files').change(function () {
            if (this.checked) {
                $('#bulk-metadata-editor-search-field').hide(300);
                $('#bulk-metadata-editor-replace-field').hide(300);
                $('#regexp-field').hide(300);
                $('#bulk-metadata-editor-add-field').hide(300);
                $('#bulk-metadata-editor-append-field').hide(300);
                $('#bulk-metadata-editor-deduplicate-field').hide(300);
                $('#bulk-metadata-editor-deduplicate-files-field').show(300);
            }
        });

        $('#changesRadio-delete').change(function () {
            if (this.checked) {
                $('#bulk-metadata-editor-search-field').hide(300);
                $('#bulk-metadata-editor-replace-field').hide(300);
                $('#regexp-field').hide(300);
                $('#bulk-metadata-editor-append-field').hide(300);
                $('#bulk-metadata-editor-add-field').hide(300);
                $('#bulk-metadata-editor-deduplicate-field').hide(300);
            }
        });

        $('#preview-items-button').click(function (event) {
            var max = 15;
            event.preventDefault();
            processItemRules();
            $.ajax({
                url: url + '/index/items/max/' + max,
                dataType: 'json',
                data: $('#bulk-metadata-editor-form').serialize(),
                timeout: 30000,
                success: function (data) {
                    if (!data) {
                        alert(language.CouldNotGeneratePreview);
                    } else {
                        var r = new Array(), j = 0;

                        r[j] = '<table><thead><tr><th scope="col">' + language.Title + '</th><th scope="col">' + language.Description + '</th><th scope="col">' + language.ItemType + '</th</tr></thead><tbody>';
                        for (var key = 0, size = data.length; key < size; key++) {
                            r[++j] ='<tr class="' + (key % 2 == 0 ? 'odd' : 'even') + '"><td>';
                            r[++j] = data[key]['title'];
                            r[++j] = '</td><td>';
                            r[++j] = data[key]['description'];
                            r[++j] = '</td><td>';
                            r[++j] = data[key]['type'];
                            r[++j] = '</td></tr>';
                        }
                        r[++j] = '</tbody></table>';

                        $('#itemPreviewDiv').html(r.join(''));
                        $('#show-more-items').click(showMoreItems);
                        $('#hide-item-preview').show();
                    }
                },
                error: function (data, errorString, error) {
                    if (errorString == 'timeout') {
                        alert(language.ItemsPreviewRequestTooLong);
                    } else {
                        alert(language.ErrorGeneratingPreview + "\n" + data.responseJSON);
                    }
                },
                complete: function (data, status) {
                    $('#items-waiting').hide();
                }
            });
            $('#items-waiting').css('display', 'inline');
        });

        $('#hide-item-preview').click(function (event) {
            event.preventDefault();
            $('#itemPreviewDiv').html('<br />');
            $('#hide-item-preview').hide();
        });

        $('#preview-fields-button').click(function (event) {
            var max = 7;
            event.preventDefault();
            processItemRules();
            $.ajax({
                url: url + '/index/fields/max/' + max,
                dataType: 'json',
                data: $('#bulk-metadata-editor-form').serialize(),
                timeout: 30000,
                success: function (data) {
                    if (!data) {
                        alert(language.CouldNotGeneratePreview);
                    } else {
                        var r = new Array(), j = 0;

                        r[j] = '<table><tbody>';
                        $.each(data, function (key, value) {
                            var title = value['title'];
                            delete value['title'];
                            r[++j] = '<tr class="even"><td colspan="2">';
                            r[++j] = title;
                            r[++j] = '</td></tr>';
                            $.each(value, function (keyInner, valueInner) {
                                r[++j] ='<tr class="odd"><td>';
                                r[++j] = valueInner['field'];
                                r[++j] = '</td><td>';
                                r[++j] = valueInner['value'];
                                r[++j] = '</td></tr>';
                            });
                        });
                        r[++j] = '</tbody></table>';

                        $('#fieldPreviewDiv').html(r.join(''));
                        $('#show-more-fields').click(showMoreFields);
                        $('#hide-field-preview').show();
                    }
                },
                error: function (data, errorString, error) {
                    if (errorString == 'timeout') {
                        alert(language.FieldsPreviewRequestTooLong);
                    } else {
                        alert(language.ErrorGeneratingPreview + "\n" + data.responseJSON);
                    }
                },
                complete: function (data, status) {
                    $('#fields-waiting').hide();
                }
            });
            $('#fields-waiting').css('display', 'inline');
        });

        $('#hide-field-preview').click(function (event) {
            event.preventDefault();
            $('#fieldPreviewDiv').html('<br />');
            $('#hide-field-preview').hide();
        });

        $('#preview-changes-button').click(function (event) {
            var max = 20;
            event.preventDefault();
            if ($('input[name=changesRadio]').is(':checked') === false) {
                alert(language.SelectActionPerform);
                return;
            }
            processItemRules();
            $.ajax({
                url: url + '/index/changes/max/' + max,
                dataType: 'json',
                data: $('#bulk-metadata-editor-form').serialize(),
                timeout: 30000,
                success: function (data) {
                    if (!data) {
                        alert(language.CouldNotGeneratePreview);
                    } else {
                        var r = new Array(), j = 0;

                        r[j] = '<table><thead><tr><th scope="col">' + language.Item + '</th><th>' + language.Field + '</th><th>' + language.OldValue + '</th><th>' + language.NewValue + '</th</tr></thead><tbody>';
                        for (var key = 0, size = data.length; key < size; key++) {
                            r[++j] ='<tr class="' + (key % 2 == 0 ? 'odd' : 'even') + '"><td>';
                            r[++j] = data[key]['item'];
                            r[++j] = '</td><td>';
                            r[++j] = data[key]['field'];
                            r[++j] = '</td><td>';
                            r[++j] = data[key]['old'];
                            r[++j] = '</td><td>';
                            r[++j] = data[key]['new'];
                            r[++j] = '</td></tr>';
                        }
                        r[++j] = '</tbody></table>';

                        $('#changesPreviewDiv').html(r.join(''));
                        $('#show-more-changes').click(showMoreChanges);
                        $('#hide-changes-preview').show();
                    }
                },
                error: function (data, errorString, error) {
                    if (errorString == 'timeout') {
                        alert(language.ChangesPreviewRequestTooLong);
                    } else {
                        alert(language.ErrorGeneratingPreview + "\n" + data.responseJSON);
                    }
                },
                complete: function (data, status) {
                    $('#changes-waiting').hide();
                }
            });
            $('#changes-waiting').css('display', 'inline');
        });

        $('#hide-changes-preview').click(function (event) {
            event.preventDefault();
            $('#changesPreviewDiv').html('<br />');
            $('#hide-changes-preview').hide();
        });

        $('.removeRule').click(function () {
            if ($('.item-rule-box').length > 1) {
                $(this).closest('.item-rule-box').remove();
            } else {
                $('#item-select-meta').trigger('click');
            }
        });
    };

    function processItemRules() {
        $('.hiddenField').remove();

        $('.bulk-metadata-editor-element-id').each(function (index) {
            var html = '<input class="hiddenField" type="hidden" name="item-rule-elements[]" value=' + $(this).val() + ' />';
            $('form').append(html);
        });

        $('.bulk-metadata-editor-compare').each(function (index) {
            var html = '<input class="hiddenField" type="hidden" name="item-compare-types[]" value=' + $(this).val() + ' />';
            $('form').append(html);
        });

        $('.bulk-metadata-editor-case').each(function (index) {
            var html = '<input class="hiddenField" type="hidden" name="item-cases[]" value=' + $(this).prop('checked') + ' />';
            $('form').append(html);
        });

        $('.bulk-metadata-editor-selector').each(function (index) {
            var html = '<input class="hiddenField" type="hidden" name="item-selectors[]" value="' + $(this).val() + '" />';
            $('form').append(html);
        });
    }

    function showMoreItems(event) {
        var max = 200;
        event.preventDefault();
        processItemRules();
        $.ajax({
            url: url + '/index/items/max/' + max,
            dataType: 'json',
            data: $('#bulk-metadata-editor-form').serialize(),
            timeout: 30000,
            success: function (data) {
                if (!data) {
                    alert(language.CouldNotGeneratePreview);
                } else {
                    var r = new Array(), j = 0;

                    r[0] = '<table><thead><tr><th scope="col">' + language.Title + '</th><th scope="col">' + language.Description + '</th><th scope="col">' + language.ItemType + '</th</tr></thead><tbody>';
                    for (var key = 0, size = data.length; key < size; key++) {
                        r[++j] ='<tr class="' + (key % 2 == 0 ? 'odd' : 'even') + '"><td>';
                        r[++j] = data[key]['title'];
                        r[++j] = '</td><td>';
                        r[++j] = data[key]['description'];
                        r[++j] = '</td><td>';
                        r[++j] = data[key]['type'];
                        r[++j] = '</td></tr>';
                    }
                    r[++j] = '</tbody></table>';

                    $('#itemPreviewDiv').html(r.join(''));
                }
            }
        });
    }

    function showMoreFields(event) {
        var max = 100;
        event.preventDefault();
        processItemRules();
        $.ajax({
            url: url + '/index/fields/max/' + max,
            dataType: 'json',
            data: $('#bulk-metadata-editor-form').serialize(),
            timeout: 30000,
            success: function (data) {
                if (!data) {
                    alert(language.CouldNotGeneratePreview);
                } else {
                    var r = new Array(), j = 0;

                    r[j] = '<table><tbody>';
                    $.each(data, function (key, value) {
                        var title = value['title'];
                        delete value['title'];
                        r[++j] = '<tr class="even"><td colspan="2">';
                        r[++j] = title;
                        r[++j] = '</td></tr>';
                        $.each(value, function (keyInner, valueInner) {
                            r[++j] ='<tr class="odd"><td>';
                            r[++j] = valueInner['field'];
                            r[++j] = '</td><td>';
                            r[++j] = valueInner['value'];
                            r[++j] = '</td></tr>';
                        });
                    });
                    r[++j] = '</tbody></table>';

                    $('#fieldPreviewDiv').html(r.join(''));
                }
            }
        });
    }

    function showMoreChanges(event) {
        var max = 200;
        event.preventDefault();
        processItemRules();
        $.ajax({
            url: url + '/index/changes/max/' + max,
            dataType: 'json',
            data: $('#bulk-metadata-editor-form').serialize(),
            timeout: 30000,
            success: function (data) {
                if (!data) {
                    alert(language.CouldNotGeneratePreview);
                } else {
                    var r = new Array(), j = 0;

                    r[j] = '<table><thead><tr><th scope="col">' + language.Item + '</th><th>' + language.Field + '</th><th>' + language.OldValue + '</th><th>' + language.NewValue + '</th</tr></thead><tbody>';
                    for (var key = 0, size = data.length; key < size; key++) {
                        r[++j] ='<tr class="' + (key % 2 == 0 ? 'odd' : 'even') + '"><td>';
                        r[++j] = data[key]['item'];
                        r[++j] = '</td><td>';
                        r[++j] = data[key]['field'];
                        r[++j] = '</td><td>';
                        r[++j] = data[key]['old'];
                        r[++j] = '</td><td>';
                        r[++j] = data[key]['new'];
                        r[++j] = '</td></tr>';
                    }
                    r[++j] = '</tbody></table>';

                    $('#changesPreviewDiv').html(r.join(''));
                }
            }
        });
    }
});
