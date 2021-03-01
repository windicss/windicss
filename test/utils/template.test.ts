import windi from '../../src/template';

describe('template', () => {
  it('template literal', () => {
    const color = 'red-500';
    const style = windi`bg-gray-100 text-${color} rounded`;
    expect(style).toEqual('bg-gray-100 text-red-500 rounded');
  });
});
