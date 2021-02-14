import { ClassParser } from "../../src/utils/parser";

describe("ClassParser", () => {
  it("should remove duplicated classes", () => {
    expect(new ClassParser('font-bold font-bold bg-red-300').parse().length).toEqual(2);
    expect(new ClassParser('font-bold font-bold bg-red-300').parse(false).length).toEqual(3);
  })

  it("parse", () => {
    const classes =
      "font-bold text-green-300 dark:font-medium dark:p-4 -sm:border +sm:float-right md: hover:  (bg-black-300 text-gray-200   text-lg dark:(bg-black-300 text-gray-200)) md:text-red-500 hover:  text-red-300 text-green-300 sm:hover:bg-red-500 dark:hover:bg-black-300 sm:dark:hover:bg-gray-300 abc bg-cool-gray-300 bg-hex-fff bg-rgb(32,31,22) bg-raw(#fff) bg-rgba(255, 0, 0, 0.3) bg-hsl(0, 100%, 25%) bg-hsla(0, 100%, 50%, 0.5)";
    const parser = new ClassParser();
    expect(parser.parse().length).toBe(0);
    parser.classNames = classes;
    expect(parser.parse()).toEqual([
      {
        raw: "font-bold",
        start: 0,
        end: 9,
        variants: [],
        content: "font-bold",
        type: "utility",
      },
      {
        raw: "text-green-300",
        start: 10,
        end: 24,
        variants: [],
        content: "text-green-300",
        type: "utility",
      },
      {
        raw: "dark:font-medium",
        start: 25,
        end: 41,
        variants: ["dark"],
        content: "font-medium",
        type: "utility",
      },
      {
        raw: "dark:p-4",
        start: 42,
        end: 50,
        variants: ["dark"],
        content: "p-4",
        type: "utility",
      },
      {
        raw: "-sm:border",
        start: 51,
        end: 61,
        variants: ["-sm"],
        content: "border",
        type: "utility",
      },
      {
        raw: "+sm:float-right",
        start: 62,
        end: 77,
        variants: ["+sm"],
        content: "float-right",
        type: "utility",
      },
      {
        raw:
          "md: hover:  (bg-black-300 text-gray-200   text-lg dark:(bg-black-300 text-gray-200))",
        start: 78,
        end: 162,
        variants: ["md", "hover"],
        content: [
          {
            raw: "bg-black-300",
            start: 91,
            end: 103,
            variants: [],
            content: "bg-black-300",
            type: "utility",
          },
          {
            raw: "text-gray-200",
            start: 104,
            end: 117,
            variants: [],
            content: "text-gray-200",
            type: "utility",
          },
          {
            raw: "text-lg",
            start: 120,
            end: 127,
            variants: [],
            content: "text-lg",
            type: "utility",
          },
          {
            raw: "dark:(bg-black-300 text-gray-200)",
            start: 128,
            end: 161,
            variants: ["dark"],
            content: [
              {
                raw: "bg-black-300",
                start: 134,
                end: 146,
                variants: [],
                content: "bg-black-300",
                type: "utility",
              },
              {
                raw: "text-gray-200",
                start: 147,
                end: 160,
                variants: [],
                content: "text-gray-200",
                type: "utility",
              },
            ],
            type: "group",
          },
        ],
        type: "group",
      },
      {
        raw: "md:text-red-500",
        start: 163,
        end: 178,
        variants: ["md"],
        content: "text-red-500",
        type: "utility",
      },
      {
        raw: "hover:  text-red-300",
        start: 179,
        end: 199,
        variants: ["hover"],
        content: "text-red-300",
        type: "utility",
      },
      {
        raw: "sm:hover:bg-red-500",
        start: 215,
        end: 234,
        variants: ["sm", "hover"],
        content: "bg-red-500",
        type: "utility",
      },
      {
        raw: "dark:hover:bg-black-300",
        start: 235,
        end: 258,
        variants: ["dark", "hover"],
        content: "bg-black-300",
        type: "utility",
      },
      {
        raw: "sm:dark:hover:bg-gray-300",
        start: 259,
        end: 284,
        variants: ["sm", "dark", "hover"],
        content: "bg-gray-300",
        type: "utility",
      },
      {
        raw: "abc",
        start: 285,
        end: 288,
        variants: [],
        content: "abc",
        type: "utility",
      },
      {
        raw: "bg-cool-gray-300",
        start: 289,
        end: 305,
        variants: [],
        content: "bg-cool-gray-300",
        type: "utility",
      },
      {
        raw: "bg-hex-fff",
        start: 306,
        end: 316,
        variants: [],
        content: "bg-hex-fff",
        type: "utility",
      },
      {
        raw: "bg-rgb(32,31,22)",
        start: 317,
        end: 333,
        variants: [],
        func: "bg-rgb",
        content: "32,31,22",
        type: "func",
      },
      {
        raw: "bg-raw(#fff)",
        start: 334,
        end: 346,
        variants: [],
        func: "bg-raw",
        content: "#fff",
        type: "func",
      },
      {
        raw: "bg-rgba(255, 0, 0, 0.3)",
        start: 347,
        end: 370,
        variants: [],
        func: "bg-rgba",
        content: "255, 0, 0, 0.3",
        type: "func",
      },
      {
        raw: "bg-hsl(0, 100%, 25%)",
        start: 371,
        end: 391,
        variants: [],
        func: "bg-hsl",
        content: "0, 100%, 25%",
        type: "func",
      },
      {
        raw: "bg-hsla(0, 100%, 50%, 0.5)",
        start: 392,
        end: 418,
        variants: [],
        func: "bg-hsla",
        content: "0, 100%, 50%, 0.5",
        type: "func",
      },
    ]);
  });
});
