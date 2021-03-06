var extend = require( "util")._extend;

/**
 * Provides parsing and evaluation of specific expressions from input messages
 *
 * @param {Object} [options] - parser properties
 * @constructor
 */
function MessageParser( options ){
    this.options = extend( this.DEFAULT_OPTIONS, options );
}

MessageParser.prototype = {
    constructor: MessageParser,

    DEFAULT_OPTIONS: {
        prefixMessage: 'calc'
    },

    ALLOWED_CHAR_SET: /^[\d\./*\-+\(\)\s]+$/,
    INVALID_MSG: '[invalid expression]',

    _retrieveExpr: function( value ){
        var prefix = this.options.messagePrefix,
            retrieved;

        if ( value.indexOf( prefix ) === 0 ){
            retrieved = value.slice( prefix.length ).trim();
        }

        return retrieved;
    },

    _validate: function( value ){
        var result = value.search( this.ALLOWED_CHAR_SET ) === 0;

        if ( ! result ){
            console.warn( 'Message._validation: expression "%s" is invalid', value );
        }

        return result;
    },

    _eval: function( expr ){
        try{
            return eval( expr );
        }catch ( e ){
            console.warn( "MessageParser._eval: ", e );
            return this.INVALID_MSG;
        }
    },

    feed: function( value ){
        var expr = this._retrieveExpr( value );

        if ( ! expr ){
            return false;
        }

        if ( ! this._validate( expr ) ){
            return this.INVALID_MSG;
        }

        return this._eval( expr ).toString();
    }
};

module.exports = MessageParser;
