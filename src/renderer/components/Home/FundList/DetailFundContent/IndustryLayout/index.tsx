import React, { useState } from 'react';
import { useRequest } from 'ahooks';

import { useHomeContext } from '@/components/Home';
import { useResizeEchart, useRenderEcharts } from '@/utils/hooks';
import * as CONST from '@/constants';
import * as Services from '@/services';
import * as Utils from '@/utils';
import styles from './index.scss';

interface IndustryLayoutProps {
  stocks: any[];
}

const IndustryLayout: React.FC<IndustryLayoutProps> = ({ stocks }) => {
  const { ref: chartRef, chartInstance } = useResizeEchart(CONST.DEFAULT.ECHARTS_SCALE);
  const { varibleColors, darkMode } = useHomeContext();

  useRenderEcharts(
    () => {
      const groupMap: Record<string, any[]> = stocks.reduce((map, data) => {
        if (!map[data.INDEXNAME]) {
          map[data.INDEXNAME] = [];
        }
        map[data.INDEXNAME].push(data);
        return map;
      }, {});

      chartInstance?.setOption({
        tooltip: { show: true },
        series: [
          {
            height: '100%',
            width: '100%',
            type: 'treemap',
            breadcrumb: { show: false },
            roam: false,
            nodeClick: false,
            data: Object.entries(groupMap).map(([key, datas]) => ({
              name: key,
              value: datas.reduce((r, c) => r + Number(c.JZBL), 0),
            })),
          },
        ],
      });
    },
    chartInstance,
    [varibleColors, darkMode, stocks]
  );

  return (
    <div className={styles.content}>
      <div ref={chartRef} style={{ width: '100%' }} />
    </div>
  );
};

export default IndustryLayout;
