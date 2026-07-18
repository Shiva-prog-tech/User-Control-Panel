"use client";

// Shared amCharts 5 foundation — every chart in the app boots from here so
// typography, hairlines and motion feel like one product ("Cupertino Ledger").

import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import Config from "@/utils/Config";

let licenseRegistered = false;

export const CHART_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", Roboto, sans-serif';

// Curated series palette — emerald first (brand), then supporting hues.
export const CHART_PALETTE = [
  0x10b981, 0x8b5cf6, 0xf59e0b, 0x0ea5e9, 0xef4444, 0x0d9488,
] as const;

export const chartColor = (index: number): am5.Color =>
  am5.color(CHART_PALETTE[index % CHART_PALETTE.length]!);

const swipeoTheme = (root: am5.Root): am5.Theme => {
  const theme = am5.Theme.new(root);

  theme.rule("Label").setAll({
    fontFamily: CHART_FONT,
    fontSize: 12,
    fontWeight: "500",
    fill: am5.color(0x86868b),
  });

  theme.rule("Grid").setAll({
    stroke: am5.color(0x1d1d1f),
    strokeOpacity: 0.06,
  });

  theme.rule("AxisTick").setAll({ visible: false });

  return theme;
};

// Root factory: animated theme + Swipeo look, transparent canvas so the
// frosted glass panels show through.
export const createSwipeoRoot = (element: HTMLElement): am5.Root => {
  // Registers the commercial licence when configured (also removes the logo).
  if (Config.AMCHARTS_LICENSE && !licenseRegistered) {
    am5.addLicense(Config.AMCHARTS_LICENSE);
    licenseRegistered = true;
  }

  const root = am5.Root.new(element);
  root.setThemes([am5themes_Animated.new(root), swipeoTheme(root)]);
  root.interfaceColors.setAll({
    text: am5.color(0x86868b),
    grid: am5.color(0x1d1d1f),
  });
  root.numberFormatter.setAll({ numberFormat: "#,###.##" });

  // Hide the free-tier watermark. NOTE: amCharts' free licence expects the
  // logo to stay visible — set NEXT_PUBLIC_AMCHARTS_LICENSE before shipping
  // this commercially.
  root._logo?.dispose();

  return root;
};
