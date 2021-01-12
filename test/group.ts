import { interpret, compile } from '../src/processor';

console.log(interpret('text-lg lg:text-2xl sm:hover:(bg-white font-bold dark:bg-gray-900) dark:(flex flex-col)'))

console.log(compile('text-lg lg:text-2xl sm:hover:(bg-white font-bold dark:bg-gray-900) dark:(flex flex-col)'))
