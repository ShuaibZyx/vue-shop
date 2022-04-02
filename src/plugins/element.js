import Vue from 'vue'
import { 
    Button, Message, Input, FormItem, Form, Container, Header, Aside, Main, Menu, Submenu,
    MenuItem, Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn, Switch, Tooltip,
    Pagination, Dialog, MessageBox, Tag, Tree, Select, Option
    } from 'element-ui'

Vue.use(Button, Form, FormItem, Input, Container, Header, Aside, Main, Menu, Submenu, MenuItem, 
    Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn, Switch, Tooltip, Pagination,
    Dialog, Tag, Tree, Select, Option
    )

//弹窗提醒比较特别，需要挂载到vue原型对象上
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

