import Processor from '../src/processor';

const processor = new Processor();

console.log(processor.interpret('text-lg lg:text-2xl sm:hover:(bg-white font-bold dark:bg-gray-900) dark:(flex flex-col)'))

console.log(processor.compile('text-lg lg:text-2xl sm:hover:(bg-white font-bold dark:bg-gray-900) dark:(flex flex-col)'))
