var template = require('../lib/template');

describe('template', function () {

  var _t = '<div>{{name.first}} {{name.last}}, {{age}}</div>'
         + '<div>{{personality.hobbies.programming}}</div>';

  it('is a function with an arity of 3', function () {
    expect(template).to.be.a('function');
    expect(template.length).to.be(3);
  });

  it('has a static function called precompile', function () {
    expect(template).to.have.property('precompile');
    expect(template.precompile).to.be.a('function');
  });

  describe('#template()', function () {

    it('throws a TypeError if no template is given', function () {
      var f = function () { return template(); };
      expect(f).to.throwError(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    // is this how it should behave?
    it('returns the unparsed template if no object map is given');
    it('returns the unparsed template if no matches from the map are found');

    it('replaces content from the map on the parent nesting level', function () {
      var t = '{{name}}'
        , result = template(t, { name: 'David' });
      expect(result).to.be('David');
    });

    it('replaces content from the map on a secondary nesting level', function () {
      var t = '{{name.first}}'
        , result = template(t, { name: { first: 'David' } });
      expect(result).to.be('David');
    });

    it('replaces content from the map on a tertiary nesting level', function () {
      var t = '{{parent.secondary.tertiary}}'
        , result = template(t, { parent: { secondary: { tertiary: 'foo' } } });
      expect(result).to.be('foo');
    });

    it('handles all nesting levels in a single template', function () {
      var map = {
        name: {
          first: 'David',
          last: 'Glivar'
        },
        age: 29,
        personality: {
          hobbies: {
            programming: 'yep'
          }
        }
      };
      var result = template(_t, map)
        , expected = '<div>David Glivar, 29</div><div>yep</div>';
      expect(result).to.be(expected);
    });

    it('returns an Element if the fragment argument is truthy', function () {
      var map = {
        name: {
          first: 'David',
          last: 'Glivar'
        },
        age: 29,
        personality: {
          hobbies: {
            programming: 'yep'
          }
        }
      };
      var result = template(_t, map, true);
      expect(result).to.be.an(Element);
    });
  });

  describe('#precompile()', function () {
    
    it('returns a function', function () {
      expect(template.precompile()).to.be.a('function');
    });

    it('curries the template into the returned function', function () {
      var map = {
        name: {
          first: 'David',
          last: 'Glivar'
        },
        age: 29,
        personality: {
          hobbies: {
            programming: 'yep'
          }
        }
      };
      var compile = template.precompile(_t)
        , expected = '<div>David Glivar, 29</div><div>yep</div>'
        , result = compile(map);
      expect(result).to.be(expected);
    });
  });
});
