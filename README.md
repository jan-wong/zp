# zp.js

### 前言

此项目的目的是为了学习jquery/zepto类库的设计思想，所以遵循2/8原则，只做重要的东西,所以功能上只做演示用

### 安装

```
<script type="text/javascript" src="./zp.js"></script>
```

### 接口

1.核心部分
选择器简单地使用了document.querySelector方法,$(selector)会返回一个节点集合对象，也可以称为类数组，这个对象只有each/text/attr方法,还支持链式调用，如下：

```
$('#test').text('test').attr('title', 'test');
$('.test').text('test').attr('title', 'test');
....
```

2.事件系统
事件系统比较简单，只支持on方法，如下：

```
$('.dog').on('click', function() {
  // 事件处理行为
})
```

3.ajax系统
其实ajax系统仅仅是对ajax的功能进行了封装，然后挂载在$的命名空间上，跟dom操作没有太大直接关系，我做了一些封装，支持如下功能：
```
$.ajax({
  type: 'POST',  //请求类型可选，不支持jsonp
  url: '/',
  //对传输数据做了序列化处理，如果是get会追加到url后面，其他的请求类型会直接xhr.send。不支持data字段中有复杂类型数据
  data: {},  
  beforeSend: function() {},
  success: function() {},
  error: function() {}
})
// 也支持$.get和$.post快捷键
$.get()
$.post()
```

