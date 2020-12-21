import Vue from 'vue'
import { Button, Card, Form, FormItem, Input, Menu, MenuItem, MenuItemGroup, Dropdown, DropdownMenu,
  DropdownItem, Select, Option, Tree, Row, Col, Table, TableColumn, Pagination, Message, MessageBox,
  Notification, Dialog, Cascader, Tag, Tooltip, Tabs, TabPane, Switch, Upload, Progress, Alert,
  ButtonGroup, Loading, Popover, Checkbox, DatePicker, Radio, RadioGroup, RadioButton, Collapse,
  CollapseItem, CheckboxGroup } from 'element-ui'

import 'element-ui/lib/theme-chalk/base.css'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
Vue.component(CollapseTransition.name, CollapseTransition)

Vue.prototype.$ELEMENT = { size: 'small' }

Vue.use(Button)
Vue.use(Card)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tree)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Cascader)
Vue.use(Tag)
Vue.use(Tooltip)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Switch)
Vue.use(Upload)
Vue.use(Progress)
Vue.use(Alert)
Vue.use(ButtonGroup)
Vue.use(Popover)
Vue.use(Checkbox)
Vue.use(DatePicker)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(CheckboxGroup)

Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service
Vue.prototype.$message = Message
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$notify = Notification
