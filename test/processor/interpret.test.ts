import { Processor } from "../../src/lib";

const processor = new Processor();

describe("Interpretation Mode", () => {
  it("interpret", () => {
    const result = processor.interpret(
      "font-bold \n\ttext-green-300 \nsm:dark:hover:text-lg sm:(bg-gray-100 hover:bg-gray-200) abc bg-cool-gray-300 bg-hex-fff"
    );
    expect(result.ignored).toEqual(["abc"]);
    expect(result.success).toEqual([
      "font-bold",
      "text-green-300",
      "sm:dark:hover:text-lg",
      "sm:bg-gray-100",
      "sm:hover:bg-gray-200",
      "bg-cool-gray-300",
      "bg-hex-fff",
    ]);
    expect(result.styleSheet.build()).toBe(
String.raw`.bg-cool-gray-300 {
  --tw-bg-opacity: 1;
  background-color: rgba(209, 213, 219, var(--tw-bg-opacity));
}
.bg-hex-fff {
  --tw-bg-opacity: 1;
  background-color: rgba(255, 255, 255, var(--tw-bg-opacity));
}
.font-bold {
  font-weight: 700;
}
.text-green-300 {
  --tw-text-opacity: 1;
  color: rgba(110, 231, 183, var(--tw-text-opacity));
}
@media (min-width: 640px) {
  .dark .sm\:dark\:hover\:text-lg:hover {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
  .sm\:bg-gray-100 {
    --tw-bg-opacity: 1;
    background-color: rgba(243, 244, 246, var(--tw-bg-opacity));
  }
  .sm\:hover\:bg-gray-200:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(229, 231, 235, var(--tw-bg-opacity));
  }
}`
    );
    expect(processor.interpret("test wrong css").success).toEqual([]);
    expect(processor.interpret("test wrong css").ignored).toEqual([
      "test",
      "wrong",
      "css",
    ]);
  });
});
