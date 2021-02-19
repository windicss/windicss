import {
  Property,
  Style,
  GlobalStyle,
  StyleSheet,
  InlineAtRule,
} from '../../src/utils/style';

describe('Style', () => {
  const p1 = new Property('padding', '1rem');
  const p2 = new Property('color', '#1C1C1E');
  const s = new Style('.test', [p1, p2]);

  it('normal build', () => {
    expect(s.build()).toBe('.test {\n  padding: 1rem;\n  color: #1C1C1E;\n}');
  });

  it('minimized build', () => {
    expect(s.build(true)).toBe('.test{padding:1rem;color:#1C1C1E}');
  });

  it('important style', () => {
    const s = new Style('.test', [p1, p2]);
    s.important = true;
    expect(s.build()).toBe('.test {\n  padding: 1rem !important;\n  color: #1C1C1E !important;\n}');
    expect(s.build(true)).toBe('.test{padding:1rem!important;color:#1C1C1E!important}');
  });

  it('empty property input', () => {
    const s = new Style('.test');
    expect(s.build()).toBe('.test {}');
    expect(s.build(true)).toBe('.test{}');
  });

  it('add property', () => {
    const s2 = new Style('.test');
    s2.add(p1);
    s2.add(p2);
    expect(s2.build()).toEqual(s.build());
  });

  it('add property list', () => {
    const s2 = new Style('.test');
    s2.add([p1, p2]);
    expect(s2.build()).toEqual(s.build());
  });

  it('get method', () => {
    const s = new Style('.test', [p1, p2]);
    s.atRule('@media (min-height: 768px)');
    s.atRule('@media (prefer-color-schemes: dark)');
    s.pseudoClass('hover');
    s.pseudoClass('focus');
    s.pseudoElement('first-line');
    s.pseudoElement('placeholder');
    s.parent('.dark');
    s.parent('.light');
    s.child('.child');
    s.child('>child');
    s.brother('bro');
    s.brother('sis');
    s.wrapRule((rule) => `:global(${rule})`);
    s.wrapSelector((selector) => `${selector}+p`);
    expect(s.atRules).toEqual([
      '@media (min-height: 768px)',
      '@media (prefer-color-schemes: dark)',
    ]);
    expect(s.pseudoClasses).toEqual(['hover', 'focus']);
    expect(s.pseudoElements).toEqual(['first-line', 'placeholder']);
    expect(s.parentSelectors).toEqual(['.dark', '.light']);
    expect(s.childSelectors).toEqual(['.child', '>child']);
    expect(s.brotherSelectors).toEqual(['bro', 'sis']);
    expect(!s.wrapRules || typeof s.wrapRules[0]).toBe('function');
    expect(!s.wrapSelectors || typeof s.wrapSelectors[0]).toBe('function');
    expect(s.rule).toBe(
      ':global(.dark .light .test+p:hover:focus::first-line::placeholder.bro.sis .child >child)'
    );
  });

  it('extend last style selector', () => {
    const s2 = new Style('.test2', new Property('background', '#fff'));
    expect(s2.extend(s).build(true)).toBe(
      '.test{background:#fff;padding:1rem;color:#1C1C1E}'
    );
  });

  it('extend properties', () => {
    const s = new Style('.test', [p1, p2]);
    const s2 = new Property('background', '#fff').toStyle();
    expect(s.extend(s2).build(true)).toBe(
      '.test{padding:1rem;color:#1C1C1E;background:#fff}'
    );
  });

  it('extend atrules', () => {
    expect(
      new Style()
        .atRule('@media (min-width: 768px)')
        .extend(new Style().atRule('@media (prefer-color-schemes: dark)'))
        .extend(s)
        .build(true)
    ).toBe(
      '@media(min-width:768px){@media(prefer-color-schemes:dark){.test{padding:1rem;color:#1C1C1E}}}'
    );
    expect(
      new Style()
        .atRule('@media (prefer-color-schemes: dark)')
        .extend(new Style().atRule('@media (min-width: 768px)'))
        .extend(s)
        .build(true)
    ).toBe(
      '@media(prefer-color-schemes:dark){@media(min-width:768px){.test{padding:1rem;color:#1C1C1E}}}'
    );
  });

  it('extend properties and pseudoes and atrules', () => {
    expect(
      new Style()
        .atRule('@media (min-width: 768px)')
        .extend(new Style().atRule('@media (prefer-color-schemes: dark)'))
        .extend(new Style().pseudoClass('hover'))
        .extend(s)
        .build(true)
    ).toBe(
      '@media(min-width:768px){@media(prefer-color-schemes:dark){.test:hover{padding:1rem;color:#1C1C1E}}}'
    );
    expect(
      new Style()
        .atRule('@media (min-width: 768px)')
        .extend(new Style().atRule('@media (prefer-color-schemes: dark)'))
        .extend(new Style().pseudoClass('hover').pseudoElement('first-line'))
        .extend(s)
        .build(true)
    ).toBe(
      '@media(min-width:768px){@media(prefer-color-schemes:dark){.test:hover::first-line{padding:1rem;color:#1C1C1E}}}'
    );
  });

  it('add pseudoClass', () => {
    expect(new Style('.test', [p1, p2]).pseudoClass('hover').rule).toBe(
      '.test:hover'
    );
    expect(
      new Style('.test', [p1, p2]).pseudoClass('hover').pseudoClass('focus')
        .rule
    ).toBe('.test:hover:focus');
  });

  it('add pseudoElement', () => {
    expect(new Style('.test', [p1, p2]).pseudoElement('first-line').rule).toBe(
      '.test::first-line'
    );
    expect(
      new Style('.test', [p1, p2])
        .pseudoElement('first-line')
        .pseudoElement('last-line').rule
    ).toBe('.test::first-line::last-line');
    expect(
      new Style('.test', [p1, p2])
        .pseudoElement('first-line')
        .pseudoClass('hover').rule
    ).toBe('.test:hover::first-line');
  });

  it('add atrule', () => {
    expect(new Style().atRule('@media (min-width: 768px)').build()).toBe(
      '@media (min-width: 768px) {}'
    );
    expect(new Style().atRule('@media (min-width: 768px)').build(true)).toBe(
      '@media(min-width:768px){}'
    );
    expect(
      new Style('.test', [p1, p2]).atRule('@media (min-width: 768px)').build()
    ).toBe(
      '@media (min-width: 768px) {\n  .test {\n    padding: 1rem;\n    color: #1C1C1E;\n  }\n}'
    );
    expect(
      new Style('.test', [p1, p2])
        .atRule('@media (min-width: 768px)')
        .build(true)
    ).toBe('@media(min-width:768px){.test{padding:1rem;color:#1C1C1E}}');
    expect(
      new Style('.test', [p1, p2])
        .atRule('@media (min-width: 768px)')
        .atRule('@media (prefers-color-scheme: dark)')
        .build()
    ).toBe(
      '@media (prefers-color-scheme: dark) {\n  @media (min-width: 768px) {\n    .test {\n      padding: 1rem;\n      color: #1C1C1E;\n    }\n  }\n}'
    );
    expect(
      new Style('.test', [p1, p2])
        .pseudoElement('first-line')
        .pseudoClass('hover')
        .atRule('@media (min-width: 768px)')
        .atRule('@media (prefers-color-scheme: dark)')
        .build()
    ).toBe(
      '@media (prefers-color-scheme: dark) {\n  @media (min-width: 768px) {\n    .test:hover::first-line {\n      padding: 1rem;\n      color: #1C1C1E;\n    }\n  }\n}'
    );
  });

  it('add parent selector', () => {
    expect(new Style('.test').parent('.dark').rule).toBe('.dark .test');
    expect(new Style('.test').parent('.dark').pseudoClass('hover').rule).toBe(
      '.dark .test:hover'
    );
  });

  it('add child selector', () => {
    expect(new Style('.test').child('p').rule).toBe('.test p');
    expect(new Style('.test').child('+ p').rule).toBe('.test + p');
    expect(new Style('.test').child(', p').rule).toBe('.test , p');
    expect(
      new Style('.test').child('> :not([hidden]) ~ :not([hidden])').rule
    ).toBe('.test > :not([hidden]) ~ :not([hidden])');
    expect(
      new Style('.test')
        .parent('.dark')
        .pseudoClass('hover')
        .child('> :not([hidden]) ~ :not([hidden])').rule
    ).toBe('.dark .test:hover > :not([hidden]) ~ :not([hidden])');
  });

  it('add brother selector', () => {
    expect(new Style('.test').brother('hello').rule).toBe('.test.hello');
    expect(new Style('.test').brother('hello').brother('world').rule).toBe(
      '.test.hello.world'
    );
  });

  it('wrap selector', () => {
    expect(
      new Style('.test').wrapSelector((selector) => `:global(${selector})`).rule
    ).toBe(':global(.test)');
    expect(
      new Style('.test')
        .wrapSelector((selector) => `:global(${selector})`)
        .wrapSelector((selector) => `:global2(${selector})`).rule
    ).toBe(':global2(:global(.test))');
    expect(
      new Style('.test')
        .pseudoClass('hover')
        .wrapSelector((selector) => `:global(${selector})`).rule
    ).toBe(':global(.test):hover');
    expect(
      new Style('.test')
        .pseudoClass('hover')
        .wrapSelector((selector) => `:global(${selector})`)
        .wrapSelector((selector) => `:global2(${selector})`).rule
    ).toBe(':global2(:global(.test)):hover');
  });

  it('wrap rule', () => {
    expect(
      new Style('.test')
        .pseudoClass('hover')
        .wrapRule((rule) => `:global(${rule})`).rule
    ).toBe(':global(.test:hover)');
    expect(
      new Style('.test')
        .wrapRule((rule) => `:global(${rule})`)
        .wrapRule((rule) => `:global2(${rule})`).rule
    ).toBe(':global2(:global(.test))');
  });

  it('clean properties', () => {
    const s = new Style('.test', [p1, p2]);
    s.add(new Property('padding', '1rem'));
    expect(s.build(true)).toBe(
      '.test{padding:1rem;color:#1C1C1E;padding:1rem}'
    );
    expect(s.clean().build(true)).toBe('.test{padding:1rem;color:#1C1C1E}');

    const s2 = new Style('.test', [
      new InlineAtRule('apply', 'font-bold'),
      new InlineAtRule('apply', 'font-bold'),
    ]);
    expect(s2.clean().build(true)).toBe('.test{@apply font-bold}');
  });

  it('flat style', () => {
    const s = new Property(
      ['-webkit-box-align', '-ms-flex-align', '-webkit-align-items'],
      'center'
    )
      .toStyle('.test')
      .flat();
    expect(s.property.length).toBe(3);
    expect(s.property.map((i) => i.name)).toEqual([
      '-webkit-box-align',
      '-ms-flex-align',
      '-webkit-align-items',
    ]);
    expect(s.property.map((i) => i.value === 'center')).toEqual([
      true,
      true,
      true,
    ]);
  });

  it('sort properties', () => {
    const s = new Style('.windi-14r5bq6');
    s.add(new Property('position', 'relative'));
    s.add(new Property(['padding-left', 'padding-right'], '1rem'));
    s.add(new Property(['padding-top', 'padding-bottom'], '2.5rem'));
    s.add(new Property('--tw-bg-opacity', '1'));
    s.add(
      new Property(
        'background-color',
        'rgba(255, 255, 255, var(--tw-bg-opacity))'
      )
    );
    s.add(
      new Property(
        '--tw-shadow',
        '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      )
    );
    s.add(
      new Property(
        ['-webkit-box-shadow', 'box-shadow'],
        'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)'
      )
    );
    expect(s.flat().sort().build(true)).toBe(
      '.windi-14r5bq6{--tw-shadow:0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);--tw-bg-opacity:1;-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);background-color:rgba(255, 255, 255, var(--tw-bg-opacity));box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);padding-bottom:2.5rem;padding-top:2.5rem;padding-right:1rem;padding-left:1rem;position:relative}'
    );
  });

  it('Generate Style From css-in-js', () => {
    const style1 = Style.generate('.card', { backgroundColor: '#fff' });
    expect(style1[0].build()).toBe('.card {\n  background-color: #fff;\n}');

    const style2 = Style.generate('.card', {
      backgroundColor: '#fff',
      borderRadius: '.25rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      '&:hover': {
        boxShadow: '0 10px 15px rgba(0,0,0,0.2)',
      },
      '@media (min-width: 500px)': {
        borderRadius: '.5rem',
      },
    });
    expect(style2.map((s) => s.build()).join('\n')).toBe(
      '.card {\n  background-color: #fff;\n  border-radius: .25rem;\n  box-shadow: 0 2px 4px rgba(0,0,0,0.2);\n}\n.card:hover {\n  box-shadow: 0 10px 15px rgba(0,0,0,0.2);\n}\n@media (min-width: 500px) {\n  .card {\n    border-radius: .5rem;\n  }\n}'
    );

    const style3 = Style.generate('@media (min-width: 500px)', {
      '.card': { backgroundColor: '#fff' },
    });
    expect(style3[0].build()).toBe(
      '@media (min-width: 500px) {\n  .card {\n    background-color: #fff;\n  }\n}'
    );

    const style4 = Style.generate('@media (min-width: 500px)', {
      '@media (prefers-color-scheme: dark)': {
        '.card': { backgroundColor: '#fff' },
      },
    });
    expect(style4[0].build()).toBe(
      '@media (min-width: 500px) {\n  @media (prefers-color-scheme: dark) {\n    .card {\n      background-color: #fff;\n    }\n  }\n}'
    );

    const style5 = Style.generate('.card', {
      '@media (min-width: 500px)': {
        '@media (prefers-color-scheme: dark)': { backgroundColor: '#fff' },
      },
    });
    expect(style5[0].build()).toBe(
      '@media (min-width: 500px) {\n  @media (prefers-color-scheme: dark) {\n    .card {\n      background-color: #fff;\n    }\n  }\n}'
    );

    const style6 = Style.generate('.alert', {
      '&:hover': { 'font-weight': 'bold' },
      '[dir=rtl] &': { 'margin-left': '0', 'margin-right': '10px' },
      ':not(&)': { opacity: '0.8' },
    });
    expect(style6.map((s) => s.build()).join('\n')).toBe(
      '.alert:hover {\n  font-weight: bold;\n}\n[dir=rtl] .alert {\n  margin-left: 0;\n  margin-right: 10px;\n}\n:not(.alert) {\n  opacity: 0.8;\n}'
    );

    const style7 = Style.generate('nav', {
      li: { display: 'inline-block' },
      a: { display: 'block' },
    });
    expect(style7.map((s) => s.build()).join('\n')).toBe(
      'nav li {\n  display: inline-block;\n}\nnav a {\n  display: block;\n}'
    );

    const style8 = Style.generate('ul >', {
      li: { display: 'inline-block' },
      a: { display: 'block' },
    });
    expect(style8.map((s) => s.build()).join('\n')).toBe(
      'ul > li {\n  display: inline-block;\n}\nul > a {\n  display: block;\n}'
    );

    const style9 = Style.generate('h2', { '+ p': { display: 'inline-block' } });
    expect(style9.map((s) => s.build()).join('\n')).toBe(
      'h2 + p {\n  display: inline-block;\n}'
    );

    const style10 = Style.generate('p', {
      '~': { span: { display: 'inline-block' }, a: { display: 'block' } },
    });
    expect(style10.map((s) => s.build()).join('\n')).toBe(
      'p ~ span {\n  display: inline-block;\n}\np ~ a {\n  display: block;\n}'
    );

    const style11 = Style.generate('.alert', {
      'ul, p': { 'margin-left': '0' },
    });
    expect(style11[0].build()).toBe(
      '.alert ul, .alert p {\n  margin-left: 0;\n}'
    );

    const style12 = Style.generate('.alert, .warning', {
      'ul, p': { 'margin-left': '0' },
    });
    expect(style12[0].build()).toBe(
      '.alert ul, .alert p, .warning ul, .warning p {\n  margin-left: 0;\n}'
    );

    const style13 = Style.generate('.accordion', {
      'max-width': '600px',
      '&__copy': { display: 'none', '&--open': { display: 'block' } },
    });
    expect(style13.map((s) => s.build()).join('\n')).toBe(
      '.accordion {\n  max-width: 600px;\n}\n.accordion__copy {\n  display: none;\n}\n.accordion__copy--open {\n  display: block;\n}'
    );

    const style14 = Style.generate('.enlarge', {'font-size': '14px', 'transition': {'property': 'font-size', 'duration': '4s', 'delay': '2s'}});
    expect(new StyleSheet(style14).build()).toBe('.enlarge {\n  font-size: 14px;\n  transition-property: font-size;\n  transition-duration: 4s;\n  transition-delay: 2s;\n}');

    const style15 = Style.generate('.test', {'outline': ['1px solid ButtonText', '1px auto -webkit-focus-ring-color']});
    expect(style15[0].build()).toBe('.test {\n  outline: 1px solid ButtonText;\n  outline: 1px auto -webkit-focus-ring-color;\n}');
  });
});

describe('Global Style', () => {
  const p1 = new Property('padding', '1rem');
  const p2 = new Property('color', '#1C1C1E');
  const s = new GlobalStyle('.test', [p1, p2]);

  it('normal build', () => {
    expect(s.build()).toBe('.test {\n  padding: 1rem;\n  color: #1C1C1E;\n}');
  });

  it('minimized build', () => {
    expect(s.build(true)).toBe('.test{padding:1rem;color:#1C1C1E}');
  });
});

snapshotContext(__filename);
