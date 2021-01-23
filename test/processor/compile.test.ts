import { Processor } from "../../src/lib";

const processor = new Processor();

describe("Compilation Mode", () => {
  it("compile", () => {
    const result = processor.compile(
      "font-bold \n\ttext-green-300 \nsm:dark:hover:text-lg sm:(bg-gray-100 hover:bg-gray-200) abc bg-cool-gray-300 bg-hex-fff"
    );
    expect(result.className).toBe("windi-o9n2ol");
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
      `.windi-o9n2ol {
  font-weight: 700;
  --tw-text-opacity: 1;
  color: rgba(110, 231, 183, var(--tw-text-opacity));
  --tw-bg-opacity: 1;
  background-color: rgba(209, 213, 219, var(--tw-bg-opacity));
  background-color: rgba(255, 255, 255, var(--tw-bg-opacity));
}
@media (min-width: 640px) {
  .dark .windi-o9n2ol:hover {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
  .windi-o9n2ol {
    --tw-bg-opacity: 1;
    background-color: rgba(243, 244, 246, var(--tw-bg-opacity));
  }
  .windi-o9n2ol:hover {
    --tw-bg-opacity: 1;
    background-color: rgba(229, 231, 235, var(--tw-bg-opacity));
  }
}`
    );
    expect(processor.compile("test wrong css").className).toBeUndefined();
  });
});
