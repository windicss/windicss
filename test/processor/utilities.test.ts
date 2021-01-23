import { Processor } from '../../src/lib';
import { StyleSheet } from '../../src/utils/style';
import { writeFileSync } from 'fs';
import classNames from '../assets/testClasses';

const processor = new Processor();

function build(classNames:string[]) {
    const success:string [] = [];
    const ignored:string [] = [];
    const styleSheet = new StyleSheet();
    classNames.forEach(className=>{
        const result = processor.extract(className);
        if (result) {
            success.push(className);
            styleSheet.add(result);
        } else {
            ignored.push(className);
        }
    })

    return {
        success,
        ignored,
        styleSheet,
    };
}

describe('Utilities', () => {
    it('build', () => {
        const result = build(classNames);
        expect(result.ignored.length).toBe(0);
        // expect(result)
        // writeFileSync('output.css', result.styleSheet.build());
    })
})



