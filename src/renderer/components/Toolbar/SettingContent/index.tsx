import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import { InputNumber, Radio, Badge, Switch, Slider, TimePicker, Input, Tabs, Select, Checkbox } from 'antd';
import dayjs from 'dayjs';
import { ReactSortable } from 'react-sortablejs';

import PureCard from '@/components/Card/PureCard';
import StandCard from '@/components/Card/StandCard';
import Logo from '@/components/Logo';
import CustomDrawerContent from '@/components/CustomDrawer/Content';
import PayCarousel from '@/components/PayCarousel';
import Guide from '@/components/Guide';
import Log from '@/components/Toolbar/SettingContent/Log';
import SettingIcon from '@/static/icon/setting.svg';
import LinkIcon from '@/static/icon/link.svg';
import LineCharIcon from '@/static/icon/line-chart.svg';
import TShirtIcon from '@/static/icon/t-shirt.svg';
import GroupIcon from '@/static/icon/group.svg';
import NotificationIcon from '@/static/icon/notification.svg';
import BitCoinIcon from '@/static/icon/bit-coin.svg';
import WindowIcon from '@/static/icon/window.svg';
import CalendarIcon from '@/static/icon/calendar.svg';
import GlobalIcon from '@/static/icon/global.svg';
import InboxIcon from '@/static/icon/inbox.svg';
import FolderSettingsIcon from '@/static/icon/folder-settings.svg';
import { setSystemSettingAction, defaultSystemSetting } from '@/store/features/setting';
import { useAppDispatch, useAppSelector, useAutoDestroySortableRef, useInputShortcut } from '@/utils/hooks';
import * as Enums from '@/utils/enums';
import * as Utils from '@/utils';
import * as Enhancement from '@/utils/enhancement';
import styles from './index.module.scss';

export interface SettingContentProps {
  onEnter: () => void;
  onClose: () => void;
}

const { shell, app, clipboard, dialog } = window.contextModules.electron;
const { electron, version } = window.contextModules.process;

const linksGroup = Utils.Group(
  [
    {
      url: 'mailto:dywzzjx@163.com',
      name: '联系作者',
    },
    {
      url: 'https://ff.1zilc.top',
      name: '官方网站',
    },
    {
      url: 'https://ff.1zilc.top/blog',
      name: '更新日志',
    },
    {
      url: 'https://github.com/1zilc/fishing-funds',
      name: 'Github',
    },
    {
      url: 'https://github.com/1zilc/fishing-funds/issues/new?assignees=&labels=&template=issue_template_bug.md',
      name: 'BUG反馈',
    },
    {
      url: 'https://github.com/1zilc/fishing-funds/issues/new?assignees=&labels=&template=issue_template_feature.md',
      name: '提出建议',
    },
  ],
  3
);

const recordSiteGroup = Utils.Group(
  [
    {
      url: 'https://lemon.qq.com/lab/app/FishingFunds.html',
      name: '柠檬精选',
    },
    {
      url: 'https://www.electronjs.org/apps/fishing-funds',
      name: 'Electron Apps',
    },
    {
      url: 'https://www.macwk.com/soft/fishing-funds',
      name: 'MacWk',
    },
    {
      url: 'https://snapcraft.io/fishing-funds',
      name: 'SnapStore',
    },
    {
      url: 'https://formulae.brew.sh/cask/fishing-funds#default',
      name: 'Homebrew',
    },
    {
      url: 'https://github.com/jaywcjlove/awesome-mac',
      name: 'Awesome Mac',
    },
    {
      url: 'https://github.com/microsoft/winget-pkgs',
      name: 'WinGet',
    },
  ],
  3
);

export const APIOptions = [
  {
    name: '东方财富-天天基金',
    code: Enums.FundApiType.Eastmoney,
    recommond: '★★★★★ (推荐)',
  },
  {
    name: '支付宝-蚂蚁基金',
    code: Enums.FundApiType.Ant,
    recommond: '★★★★☆',
  },
  {
    name: '同花顺-爱基金',
    code: Enums.FundApiType.Fund10jqka,
    recommond: '★★★★☆',
  },
  {
    name: '腾讯证券',
    code: Enums.FundApiType.Tencent,
    recommond: '★★★★☆',
  },
  {
    name: '新浪基金',
    code: Enums.FundApiType.Sina,
    recommond: '★★★★☆',
  },
  {
    name: '基金速查网',
    code: Enums.FundApiType.Dayfund,
    recommond: '★★★☆☆',
  },
  {
    name: '好买基金',
    code: Enums.FundApiType.Howbuy,
    recommond: '★★★☆☆',
  },
  {
    name: '易天富',
    code: Enums.FundApiType.Etf,
    recommond: '★★★☆☆',
  },
];

const SettingContent: React.FC<SettingContentProps> = (props) => {
  const dispatch = useAppDispatch();
  const sortableRef = useAutoDestroySortableRef();
  const {
    fundApiTypeSetting,
    conciseSetting,
    lowKeySetting,
    baseFontSizeSetting,
    systemThemeSetting,
    bottomTabsSetting,
    adjustmentNotificationSetting,
    adjustmentNotificationTimeSetting,
    riskNotificationSetting,
    trayContentSetting,
    coinUnitSetting,
    proxyTypeSetting,
    proxyHostSetting,
    proxyPortSetting,
    hotkeySetting,
    autoStartSetting,
    autoFreshSetting,
    freshDelaySetting,
    autoCheckUpdateSetting,
    timestampSetting,
    syncConfigSetting,
    syncConfigPathSetting,
  } = useAppSelector((state) => state.setting.systemSetting);
  const updateInfo = useAppSelector((state) => state.updater.updateInfo);
  const isUpdateAvaliable = !!updateInfo.version;

  // 数据来源
  const [fundapiType, setFundApiType] = useState(fundApiTypeSetting);
  // 外观设置
  const [concise, setConcise] = useState(conciseSetting);
  const [lowKey, setLowKey] = useState(lowKeySetting);
  const [baseFontSize, setBaseFontSize] = useState(baseFontSizeSetting);
  const [systemTheme, setSystemTheme] = useState(systemThemeSetting);
  // 底栏设置
  const [bottomTabs, setBottomTabs] = useState(bottomTabsSetting);
  // 通知设置
  const [adjustmentNotification, setAdjustmentNotification] = useState(adjustmentNotificationSetting);
  const [adjustmentNotificationTime, setAdjustmentNotifitationTime] = useState(adjustmentNotificationTimeSetting);
  const [riskNotification, setRiskNotification] = useState(riskNotificationSetting);
  const [trayContent, setTrayContent] = useState(trayContentSetting);
  // 货币单位
  const [coinUnit, setCoinUnit] = useState(coinUnitSetting);
  // 代理设置
  const [proxyType, setProxyType] = useState(proxyTypeSetting);
  const [proxyHost, setProxyHost] = useState(proxyHostSetting);
  const [proxyPort, setProxyPort] = useState(proxyPortSetting);
  // 通用设置
  const { hotkey, inputRef: hotkeyInputRef, reset: resetHotkey } = useInputShortcut(hotkeySetting);
  const [autoStart, setAutoStart] = useState(autoStartSetting);
  const [autoFresh, setAutoFresh] = useState(autoFreshSetting);
  const [freshDelay, setFreshDelay] = useState(freshDelaySetting);
  const [autoCheckUpdate, setAutoCheckUpdate] = useState(autoCheckUpdateSetting);
  const [timestamp, setTimestamp] = useState(timestampSetting);
  // 配置同步
  const [syncConfig, setSyncConfig] = useState(syncConfigSetting);
  const [syncConfigPath, setSyncConfigPath] = useState(syncConfigPathSetting);

  const proxyModeEnable = proxyType === Enums.ProxyType.Http || proxyType === Enums.ProxyType.Socks;

  async function onSave() {
    await dispatch(
      setSystemSettingAction({
        fundApiTypeSetting: fundapiType,
        conciseSetting: concise,
        lowKeySetting: lowKey,
        baseFontSizeSetting: baseFontSize,
        systemThemeSetting: systemTheme,
        bottomTabsSetting: bottomTabs.map((tab) => ({ key: tab.key, name: tab.name, show: tab.show })),
        adjustmentNotificationSetting: adjustmentNotification,
        adjustmentNotificationTimeSetting: adjustmentNotificationTime || defaultSystemSetting.adjustmentNotificationTimeSetting,
        riskNotificationSetting: riskNotification,
        trayContentSetting: trayContent,
        coinUnitSetting: coinUnit,
        proxyTypeSetting: proxyType,
        proxyHostSetting: proxyHost,
        proxyPortSetting: proxyPort,
        hotkeySetting: hotkey,
        autoStartSetting: autoStart,
        autoFreshSetting: autoFresh,
        freshDelaySetting: freshDelay || defaultSystemSetting.freshDelaySetting,
        autoCheckUpdateSetting: autoCheckUpdate,
        timestampSetting: timestamp,
        syncConfigSetting: syncConfig,
        syncConfigPathSetting: syncConfigPath,
      })
    );
    props.onEnter();
  }

  function onNavigate(url: string) {
    shell.openExternal(url);
  }

  function onCopyGroup(number: string) {
    clipboard.writeText(number);
    dialog.showMessageBox({
      title: '复制成功',
      type: 'info',
      message: `已复制到粘贴板`,
    });
  }

  function onBottomTabCheckChange(key: Enums.TabKeyType) {
    const tabsCheckedKeys = bottomTabs.filter(({ show }) => show).map(({ key }) => key);
    const disableTabsCheck = tabsCheckedKeys.length <= 1;

    setBottomTabs(
      bottomTabs.map((tab) => ({
        ...tab,
        show: tab.key === key ? (tab.show && disableTabsCheck ? tab.show : !tab.show) : tab.show, // 至少选择一个
      }))
    );
  }

  async function onSelectSyncConfigPath() {
    const { filePath, canceled } = await dialog.showSaveDialog({
      title: '选择路径',
      defaultPath: `Fishing-Funds-Sync.ff`,
      filters: [{ name: 'Fishing Funds', extensions: ['ff'] }],
      buttonLabel: '确认',
    });
    if (canceled) {
      return;
    }
    setSyncConfigPath(filePath!);
  }

  return (
    <CustomDrawerContent title="设置" enterText="保存" onClose={props.onClose} onEnter={onSave}>
      <style>{` html { font-size: ${baseFontSize}px }`}</style>
      <PureCard
        className={clsx(
          styles.logo,
          {
            clickable: isUpdateAvaliable,
          },
          'card-body'
        )}
        onClick={() => isUpdateAvaliable && onNavigate('https://ff.1zilc.top/#download')}
      >
        <Logo />
        <Badge count={isUpdateAvaliable ? `v${updateInfo.version} 可更新` : 0} style={{ fontSize: 8 }} size="small">
          <div className={styles.appName}>Fishing Funds v{version}</div>
        </Badge>
      </PureCard>
      <Tabs animated={{ tabPane: true }} tabBarGutter={15} tabBarStyle={{ marginLeft: 15 }}>
        <Tabs.TabPane tab="基础设置" key={String(0)}>
          <div className={styles.content}>
            <StandCard
              icon={<LineCharIcon />}
              title="数据来源"
              extra={
                <div className={styles.guide}>
                  <Guide list={APIOptions.map(({ name, recommond }) => ({ name, text: recommond }))} />
                </div>
              }
            >
              <div className={clsx(styles.setting, 'card-body')}>
                <Radio.Group value={fundapiType} onChange={(e) => setFundApiType(e.target.value)}>
                  {APIOptions.map((api) => (
                    <Radio key={api.code} className={styles.radio} value={api.code}>
                      {api.name}
                    </Radio>
                  ))}
                </Radio.Group>
              </div>
            </StandCard>
            <StandCard icon={<TShirtIcon />} title="外观设置">
              <div className={clsx(styles.setting, 'card-body')}>
                <section>
                  <label>简洁模式：</label>
                  <Switch size="small" checked={concise} onChange={setConcise} />
                </section>
                <section>
                  <label>低调模式：</label>
                  <Switch size="small" checked={lowKey} onChange={setLowKey} />
                </section>
                <section>
                  <label>字体大小：</label>
                  <Slider min={11} max={14} style={{ flex: 0.5 }} defaultValue={baseFontSize} onChange={setBaseFontSize} step={0.1} />
                </section>
                <section>
                  <label>系统主题：</label>
                  <Radio.Group
                    optionType="button"
                    size="small"
                    buttonStyle="solid"
                    options={[
                      { label: '亮', value: Enums.SystemThemeType.Light },
                      { label: '暗', value: Enums.SystemThemeType.Dark },
                      { label: '自动', value: Enums.SystemThemeType.Auto },
                    ]}
                    onChange={(e) => setSystemTheme(e.target.value)}
                    value={systemTheme}
                  />
                </section>
              </div>
            </StandCard>
            <StandCard
              icon={<NotificationIcon />}
              title="通知设置"
              extra={
                <div className={styles.guide}>
                  <Guide
                    list={[
                      { name: '调仓提醒', text: '将在预设时间发出调仓通知' },
                      { name: '基金提醒', text: '开启后可在基金设置中配置自定义涨幅、净值提醒' },
                      { name: '托盘内容', text: '仅限macos客户端，菜单栏显示当日收益等信息' },
                    ]}
                  />
                </div>
              }
            >
              <div className={clsx(styles.setting, 'card-body')}>
                <section>
                  <label>调仓提醒：</label>
                  <Switch size="small" checked={adjustmentNotification} onChange={setAdjustmentNotification} />
                </section>
                <section>
                  <label>提醒时间：</label>
                  <TimePicker
                    disabled={!adjustmentNotification}
                    allowClear={false}
                    size="small"
                    value={dayjs(adjustmentNotificationTime)}
                    onChange={(v) => setAdjustmentNotifitationTime(dayjs(v).format())}
                    format="HH:mm"
                  />
                </section>
                <section>
                  <label>基金提醒：</label>
                  <Switch size="small" checked={riskNotification} onChange={setRiskNotification} />
                </section>
                <section>
                  <label>托盘内容：</label>
                  <Select
                    mode="multiple"
                    size="small"
                    allowClear
                    style={{ width: '50%' }}
                    placeholder="无"
                    value={trayContent}
                    onChange={setTrayContent}
                  >
                    <Select.Option value={Enums.TrayContent.Sy}>选中钱包收益</Select.Option>
                    <Select.Option value={Enums.TrayContent.Syl}>选中钱包收益率</Select.Option>
                    <Select.Option value={Enums.TrayContent.Zsy}>所有钱包收益</Select.Option>
                    <Select.Option value={Enums.TrayContent.Zsyl}>所有钱包收益率</Select.Option>
                  </Select>
                </section>
              </div>
            </StandCard>
            <StandCard
              icon={<InboxIcon />}
              title="底栏设置"
              extra={
                <div className={styles.guide}>
                  <Guide list={[{ name: '底栏设置', text: '对底部模块进行选择和排序' }]} />
                </div>
              }
            >
              <div className={clsx(styles.setting, 'card-body')}>
                <ReactSortable
                  ref={sortableRef}
                  animation={200}
                  delay={2}
                  list={bottomTabs.map((_) => ({ ..._, id: _.key }))}
                  setList={setBottomTabs}
                  className={styles.bottomTabsRow}
                  swap
                >
                  {bottomTabs.map((tab) => {
                    return (
                      <PureCard key={tab.key}>
                        <div className={styles.bottomTabItem}>
                          <div>{tab.name}</div>
                          <Checkbox checked={tab.show} onClick={() => onBottomTabCheckChange(tab.key)} />
                        </div>
                      </PureCard>
                    );
                  })}
                </ReactSortable>
              </div>
            </StandCard>
            <StandCard
              icon={<BitCoinIcon />}
              title="货币单位"
              extra={
                <div className={styles.guide}>
                  <Guide list={[{ name: '货币单位', text: '仅用做货币模块单位换算，其余模块单位均为人民币' }]} />
                </div>
              }
            >
              <div className={clsx(styles.setting, 'card-body')}>
                <Radio.Group value={coinUnit} onChange={(e) => setCoinUnit(e.target.value)}>
                  <Radio className={styles.radio} value={Enums.CoinUnitType.Usd}>
                    USD ($)
                  </Radio>
                  <Radio className={styles.radio} value={Enums.CoinUnitType.Cny}>
                    CNY (¥)
                  </Radio>
                  <Radio className={styles.radio} value={Enums.CoinUnitType.Btc}>
                    BTC (฿)
                  </Radio>
                </Radio.Group>
              </div>
            </StandCard>
            <StandCard icon={<GlobalIcon />} title="代理设置">
              <div className={clsx(styles.setting, 'card-body')}>
                <section>
                  <label>代理模式：</label>
                  <Radio.Group
                    optionType="button"
                    size="small"
                    buttonStyle="solid"
                    options={[
                      { label: '无', value: Enums.ProxyType.None },
                      { label: '系统', value: Enums.ProxyType.System },
                      { label: 'http', value: Enums.ProxyType.Http },
                      { label: 'socks', value: Enums.ProxyType.Socks },
                    ]}
                    onChange={(e) => setProxyType(e.target.value)}
                    value={proxyType}
                  />
                </section>
                <section>
                  <label>代理地址：</label>
                  <Input size="small" value={proxyHost} onChange={(e) => setProxyHost(e.target.value)} disabled={!proxyModeEnable} />
                </section>
                <section>
                  <label>代理端口：</label>
                  <Input size="small" value={proxyPort} onChange={(e) => setProxyPort(e.target.value)} disabled={!proxyModeEnable} />
                </section>
              </div>
            </StandCard>
            <StandCard
              icon={<SettingIcon />}
              title="系统设置"
              extra={
                <div className={styles.guide}>
                  <Guide
                    list={[
                      { name: '快捷键', text: '设置快捷键快速显示/隐藏程序' },
                      { name: '自动刷新', text: '开启后将自动间隔预设时间进行数据刷新' },
                      { name: '刷新间隔', text: '单位（分钟）' },
                      { name: '时间戳', text: '当前时间节点默认使用淘宝、苏宁等网络时间戳，若自动刷新功能失效，请尝试切换到本地时间戳' },
                    ]}
                  />
                </div>
              }
            >
              <div className={clsx(styles.setting, 'card-body')}>
                <section>
                  <label>快捷键 {hotkey && <a onClick={resetHotkey}>(重置)</a>}：</label>
                  <input ref={hotkeyInputRef} value={hotkey} placeholder="显示/隐藏快捷键" type="text" />
                </section>
                <section>
                  <label>开机自启：</label>
                  <Switch size="small" checked={autoStart} onChange={setAutoStart} />
                </section>
                <section>
                  <label>自动刷新：</label>
                  <Switch size="small" checked={autoFresh} onChange={setAutoFresh} />
                </section>
                <section>
                  <label>刷新间隔：</label>
                  <InputNumber
                    disabled={!autoFresh}
                    value={freshDelay}
                    onChange={setFreshDelay}
                    placeholder="1~60分钟"
                    precision={0}
                    min={1}
                    max={60}
                    size="small"
                  />
                </section>
                <section>
                  <label>自动检查更新：</label>
                  <Switch size="small" checked={autoCheckUpdate} onChange={setAutoCheckUpdate} />
                </section>
                <section>
                  <label>时间戳：</label>
                  <Radio.Group
                    optionType="button"
                    size="small"
                    buttonStyle="solid"
                    options={[
                      { label: '本地', value: Enums.TimestampType.Local },
                      { label: '网络', value: Enums.TimestampType.Network },
                    ]}
                    onChange={(e) => setTimestamp(e.target.value)}
                    value={timestamp}
                  />
                </section>
              </div>
            </StandCard>
            <StandCard
              icon={<FolderSettingsIcon />}
              title="配置同步"
              extra={
                <div className={styles.guide}>
                  <Guide
                    list={[
                      { name: '开启同步', text: '开启后自动存储配置文件至指定路径，启动时优先读取该路径配置' },
                      { name: '同步路径', text: '配置文件路径（通过iCloud、OneDrive等方式自动同步该文件至云端实现多台设备配置同步）' },
                      { name: '同步范围', text: '支持钱包，基金，指数，板块，股票，货币，h5配置同步' },
                    ]}
                  />
                </div>
              }
            >
              <div className={clsx(styles.setting, 'card-body')}>
                <section>
                  <label>开启同步：</label>
                  <Switch size="small" checked={syncConfig} onChange={setSyncConfig} />
                </section>
                <section>
                  <label>
                    同步路径{' '}
                    {!!syncConfigPath ? (
                      <a onClick={() => setSyncConfigPath('')}>(清除)</a>
                    ) : (
                      <a onClick={onSelectSyncConfigPath}>(选择)</a>
                    )}
                    ：
                  </label>
                  <Input size="small" value={syncConfigPath} disabled />
                </section>
              </div>
            </StandCard>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="更新日志" key={String(1)}>
          <div className={styles.content}>
            <StandCard icon={<CalendarIcon />} title="更新日志">
              <Log />
            </StandCard>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="更多信息" key={String(2)}>
          <div className={styles.content}>
            <PayCarousel />
            <StandCard
              icon={<LinkIcon />}
              title="关于 Fishing Funds"
              extra={
                <div className={styles.guide}>
                  <Guide list={[{ name: '☕️', text: 'buy me a coffee :)' }]} />
                </div>
              }
            >
              <div className={clsx('card-body')}>
                <div className={clsx(styles.describe)}>
                  Fishing Funds
                  是一款个人开发小软件，开源后深受大家的喜爱，接受了大量宝贵的改进建议，感谢大家的反馈，作者利用空闲时间开发不易，您的支持可以给本项目的开发和完善提供巨大的动力，感谢对本软件的喜爱和认可
                  :)
                </div>
                {linksGroup.map((links, index) => (
                  <div key={index} className={styles.link}>
                    {links.map((link) => (
                      <React.Fragment key={link.name}>
                        <a onClick={() => onNavigate(link.url)}>{link.name}</a>
                        <i />
                      </React.Fragment>
                    ))}
                  </div>
                ))}
              </div>
            </StandCard>
            <StandCard icon={<GroupIcon />} title="讨论交流">
              <div className={clsx(styles.group, 'card-body')}>
                <section>
                  <label>QQ群：</label>
                  <a onClick={() => onCopyGroup('732268738')}>732268738</a>
                </section>
                <section>
                  <label>issues：</label>
                  <a onClick={() => onNavigate('https://github.com/1zilc/fishing-funds/issues/106')}>#106</a>
                </section>
                <section>
                  <label>Telegram：</label>
                  <a onClick={() => onNavigate('https://t.me/fishing_funds')}>t.me/fishing_funds</a>
                </section>
              </div>
            </StandCard>
            <StandCard icon={<WindowIcon />} title="收录网站">
              <div className={clsx('card-body')}>
                {recordSiteGroup.map((links, index) => (
                  <div key={index} className={styles.link}>
                    {links.map((link) => (
                      <React.Fragment key={link.name}>
                        <a onClick={(e) => onNavigate(link.url)}>{link.name}</a>
                        <i />
                      </React.Fragment>
                    ))}
                  </div>
                ))}
              </div>
            </StandCard>
          </div>
        </Tabs.TabPane>
      </Tabs>
      <div className={styles.exit}>
        <button type="button" onClick={app.quit}>
          退出程序
        </button>
      </div>
      <div className={styles.version}>
        <div>Based on Electron v{electron}</div>
      </div>
    </CustomDrawerContent>
  );
};

export default SettingContent;