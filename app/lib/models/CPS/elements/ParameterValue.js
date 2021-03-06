define([
    'metapolator/errors'
  , './_Node'
], function(
    errors
  , Parent
) {
    "use strict";
    /**
     * The value of a Parameter.
     *
     * TODO: the value needs to be examined, we need a canonical version
     * of it. Otherwise one effect is, that we add too much whitespace
     * when serializing with toString (because we don't remove whitespace
     * when extracting the comments)
     * This will probably happen when we start to really process the values.
     */
    function ParameterValue(value, comments ,source, lineNo) {
        Parent.call(this, source, lineNo);

        this._value = value;
        this._comments = comments;
        this._factory = undefined;
        this.factory = undefined;
        this.invalid = false;
        this.message = undefined;
    }
    var _p = ParameterValue.prototype = Object.create(Parent.prototype);
    _p.constructor = ParameterValue;

    Object.defineProperty(_p, 'value', {
        get: function(){ return '!!stub!!' + this._value.join('|||'); }
    });

    function _setInvalidAPI(message) {
        /*jshint validthis:true*/
        if(this._factory !== undefined)
            throw new errors.CPS('Can\'t mark as invalid: factory is already '
                                + 'set.');
        Object.defineProperty(this, 'invalid', {
            value: true
          , enumerable: true
        });

        Object.defineProperty(this, 'message', {
            value: message
          , enumerable: true
        });
    }

    function _setFactoryAPI(factory) {
        /*jshint validthis:true*/
        if(this.invalid)
            throw new errors.CPS('Can\'t set factory: value is already '
                                + 'marked as invalid: ' + this._message);
        if(this._factory !== undefined)
            throw new errors.CPS('Factory is already set!');
        if(!(factory instanceof Function))
            throw new errors.CPS('Factory must be a function but is: '
                                + typeof factory);
        this._factory = factory;
        Object.defineProperty(this, 'factory', {
            enumerable: true
          , value: factory
        });
    }

    _p.initializeTypeFactory = function(name, typeDefinition) {
        if(this._factory !== undefined)
            throw new errors.CPS('Factory is already set!');
        if(this.invalid)
            throw new errors.CPS('Can\'t set factory: value is already '
                    + 'marked as invalid: ' + this._message);
        typeDefinition.init(this, _setFactoryAPI.bind(this),
                                  _setInvalidAPI.bind(this));

        if(this._factory === undefined && this.invalid === false)
            throw new errors.CPS('TypeDefinition for ' + name
                            + ' did not initialize this ParameterValue');
    };

    // this property ommits the comments on purpose
    Object.defineProperty(_p, 'valueString', {
        get: function(){ return this._value.join(''); }
    });

    Object.defineProperty(_p, 'astTokens', {
        get: function() {
            return this._value.map(
                                function(item){ return item._ast; });
            }
    });

    /**
     * Prints all comments before the value.
     */
    _p.toString = function() {
        return [this._comments.join('\n'),
                this._comments.length ? ' ': '',
                this.valueString.trim()].join('');
    };

    return ParameterValue;
});
