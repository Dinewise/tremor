import {
  Color,
  defaultValueFormatter,
  getColorClassNames,
  makeClassName,
  sizing,
  spacing,
  tremorTwMerge,
  ValueFormatter,
} from "lib";
import { colorPalette } from "lib/theme";
import React, { useCallback, useEffect } from "react";

const makeBarListClassName = makeClassName("BarList");

type Bar = {
  key?: string;
  value: number;
  name: string;
  icon?: React.JSXElementConstructor<any>;
  href?: string;
  target?: string;
  color?: Color;
};

const getWidthsFromValues = (dataValues: number[]) => {
  let maxValue = -Infinity;
  dataValues.forEach((value) => {
    maxValue = Math.max(maxValue, value);
  });

  return dataValues.map((value) => {
    if (value === 0) return 0;
    return Math.max((value / maxValue) * 100, 1);
  });
};

export interface BarListProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Bar[];
  valueFormatter?: ValueFormatter;
  color?: Color;
  showAnimation?: boolean;
  labelPosition?: "default" | "top";
  classNames?: {
    bar?: string;
    label?: string;
    value?: string;
  };
}

const BarList = React.forwardRef<HTMLDivElement, BarListProps>((props, ref) => {
  const {
    data = [],
    color,
    valueFormatter = defaultValueFormatter,
    showAnimation = false,
    className,
    classNames,
    labelPosition = "default",
    ...other
  } = props;
  const widths = getWidthsFromValues(data.map((item) => item.value));

  const rowHeight = sizing.threeXl.height;

  return (
    <div
      ref={ref}
      className={tremorTwMerge(
        makeBarListClassName("root"),
        "flex justify-between",
        spacing.threeXl.spaceX,
        className,
      )}
      {...other}
    >
      <div className={tremorTwMerge(makeBarListClassName("bars"), "relative w-full")}>
        {data.map((item, idx) => {
          const Icon = item.icon;
          const label = (
            <>
              {Icon ? (
                <Icon
                  className={tremorTwMerge(
                    makeBarListClassName("barIcon"),
                    // common
                    "flex-none",
                    // light
                    "text-tremor-content",
                    // dark
                    "dark:text-dark-tremor-content",
                    sizing.lg.height,
                    sizing.lg.width,
                    spacing.md.marginRight,
                  )}
                />
              ) : null}
              {item.href ? (
                <a
                  href={item.href}
                  target={item.target ?? "_blank"}
                  rel="noreferrer"
                  className={tremorTwMerge(
                    makeBarListClassName("barLink"),
                    // common
                    "whitespace-nowrap hover:underline truncate text-tremor-default",
                    // light
                    "text-tremor-content-emphasis",
                    // dark
                    "dark:text-dark-tremor-content-emphasis",
                    classNames?.label,
                  )}
                >
                  {item.name}
                </a>
              ) : (
                <p
                  className={tremorTwMerge(
                    makeBarListClassName("barText"),
                    // common
                    "whitespace-nowrap truncate text-tremor-default",
                    // light
                    "text-tremor-content-emphasis",
                    // dark
                    "dark:text-dark-tremor-content-emphasis",
                    classNames?.label,
                  )}
                >
                  {item.name}
                </p>
              )}
            </>
          );
          return (
            <div key={`${item.name}-${idx}`} className="flex flex-col">
              {labelPosition === "top" ? <div className="max-w-full">{label}</div> : null}
              <div className="flex flex-row justify-between">
                <div
                  key={item.key ?? item.name}
                  className={tremorTwMerge(
                    makeBarListClassName("bar"),
                    // common
                    "flex items-center rounded-tremor-small bg-opacity-30",
                    rowHeight,
                    item.color || color
                      ? getColorClassNames(item.color ?? (color as Color), colorPalette.background)
                          .bgColor
                      : "bg-tremor-brand-subtle dark:bg-dark-tremor-brand-subtle dark:bg-opacity-30",
                    idx === data.length - 1 ? spacing.none.marginBottom : spacing.sm.marginBottom,
                    classNames?.bar,
                  )}
                  style={{
                    width: `${widths[idx]}%`,
                    transition: showAnimation ? "all 1s" : "",
                  }}
                >
                  {labelPosition === "default" ? (
                    <div className={tremorTwMerge("absolute max-w-full flex", spacing.sm.left)}>
                      {label}
                    </div>
                  ) : null}
                </div>
                {labelPosition === "top" ? (
                  <div className={spacing.threeXl.marginLeft}>
                    <ValueComponent
                      {...{ item, rowHeight, idx, data, classNames, valueFormatter }}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      {labelPosition === "default" ? (
        <div className={(makeBarListClassName("labels"), "text-right min-w-min")}>
          {data.map((item, idx) => (
            <ValueComponent {...{ item, rowHeight, idx, data, classNames, valueFormatter }} />
          ))}
        </div>
      ) : null}
    </div>
  );
});

BarList.displayName = "BarList";

export default BarList;

type ValueComponentProps = {
  item: Bar;
  rowHeight: string;
  idx: number;
  data: Bar[];
  classNames:
    | { bar?: string | undefined; label?: string | undefined; value?: string | undefined }
    | undefined;
  valueFormatter: ValueFormatter;
};

const ValueComponent = ({
  item,
  rowHeight,
  idx,
  data,
  classNames,
  valueFormatter,
}: ValueComponentProps) => {
  return (
    <div
      key={item.key ?? item.name}
      className={tremorTwMerge(
        makeBarListClassName("labelWrapper"),
        "flex justify-end items-center",
        rowHeight,
        idx === data.length - 1 ? spacing.none.marginBottom : spacing.sm.marginBottom,
      )}
    >
      <p
        className={tremorTwMerge(
          makeBarListClassName("labelText"),
          // common
          "whitespace-nowrap truncate text-tremor-default",
          // light
          "text-tremor-content-emphasis",
          // dark
          "dark:text-dark-tremor-content-emphasis",
          classNames?.value,
        )}
      >
        {valueFormatter(item.value)}
      </p>
    </div>
  );
};
