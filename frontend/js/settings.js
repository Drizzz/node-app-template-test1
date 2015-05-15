(function () {
    var $ = window.$;

    // Step 1. Define default path to file with schema
    var settingsSchemaSrc = "js/settings.schema.json"; // default path to json schema of sesstings' fields

    // Step 2. If custom path was defined - is it
    if (settingsSchemaSrc in window) {
        settingsSchemaSrc = window.settingsSchemaSrc;    // use custom path if exists
    }

    // Step 3. Get data from json file. Call onPropertiesSchemaReady() when schema received
    $.getJSON(settingsSchemaSrc, function (propertiesSchema) {
        onPropertiesSchemaReady(propertiesSchema);
    });

    // Step 4. Render form (using cool JSONEditor), init some other tools and listen "click" on form's submit button
    var onPropertiesSchemaReady = function (propertiesSchema) {

        /**
         * JSON Schema -> HTML Editor
         * https://github.com/jdorn/json-editor/
         */
        var editor = new JSONEditor($('#form-setting')[0], {
            disable_collapse: true,
            disable_edit_json: true,
            disable_properties: true,
            no_additional_properties: true,
            schema: {
                type: 'object',
                title: 'Alchemy test app',
                properties: {
                apiKey: {
                    title: 'API key',
                    type: 'string',
                    minLength: 40,
                    maxLength: 40
                },
                minRelevance: {
                    title: 'Minimal relevance',
                    type: 'number',
                    minimum: 0.1,
                    maximum: 1,
                    multipleOf: 0.1,
                    'default': 0.1
                },
                amountInterests: {
                    title: 'Amount of stored interests',
                    type: 'number',
                    minimum: 1,
                    maximum: 20,
                    multipleOf: 1,
                    'default': 10
                },
                entityType: {
                    title: 'Entity type',
                    type: 'array',
                    uniqueItems: true,
                    items: {
                        type: 'string',
                        'enum': ['Anatomy', 'Automobile', 'Anniversary', 'City', 'Company', 'Continent', 'Country', 'Degree', 'Drug', 'EmailAddress', 'EntertainmentAward', 'Facility', 'FieldTerminology', 'FinancialMarketIndex', 'GeographicFeature', ' Hashtag ', 'HealthCondition', 'Holiday', 'IPAddress', 'JobTitle', 'Movie', 'MusicGroup', 'NaturalDisaster', 'OperatingSystem', 'Organization', 'Person', 'PrintMedia', 'Quantity', 'RadioProgram', 'RadioStation', 'Region', 'Sport', 'StateOrCounty', 'Technology', 'TelevisionShow', 'TelevisionStation', 'TwitterHandle']
                    },
                    'default': ['FieldTerminology']
                }
            }
            },
            required: ['apiKey', 'minRelevance', 'amountInterests', 'entityType'],
            required_by_default: true,
            theme: 'bootstrap3'
        });
        
        // Init loader
        var loader = new Loader();
        loader.show();

        // Init IframeHelper
        var inno = new IframeHelper();
        inno.onReady(function () {
            inno.getProperties(function (status, data) {
                if (status) {
                    editor.setValue(data);
                } else {
                    alert('Error: unable to get Settings from Profile Cloud');
                }
                loader.hide();
            });
        });

        // Listen submit button click event
        $('#submit-setting').on('click', function () {
            var errors = editor.validate();
            if (errors.length) {
                errors = errors.map(function (error) {
                    var field = editor.getEditor(error.path),
                        title = field.schema.title;
                    return title + ': ' + error.message;
                });
                alert(errors.join('\n'));
            } else {
                loader.show();
                inno.setProperties(editor.getValue(), function (status) {
                    loader.hide();
                    if (status) {
                        alert('Settings were saved.');
                    }
                });
            }
        });
    };

})();
