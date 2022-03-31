import Vue from 'vue'
import { Button, Message, Input, FormItem, Form} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

//弹窗提醒比较特别，需要挂载到vue原型对象上
Vue.prototype.$message = Message

