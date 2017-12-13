/**
 * @description Zpjs是一个极简版的zepto.js，主要目的是为了学习jQuery/Zepto类库的设计思想
 * @author Jan<543050768@qq.com>
 */

;(function(global) {
  var Zp = (function() {
    var $, Z, qsa;
    /**
     * @description css选择器
     * @param element dom节点
     * @param selector 选择器
     * @return 包含dom节点的数组
     */
    qsa = function(element, selector) {
      return [].slice.call(element.querySelectorAll(selector));
    }

    /**
     * @description 创建一个节点集合的数据类型
     */
    Z = function(dom, selector) {
      this.length = dom.length;
      for(var i = 0; i < this.length; i++) this[i] = dom[i];
      this.selector = selector;
    }

    /**
     * @description 根据selector创建一个节点集合对象
     */
    $ = function(selector) {
      return new Z(qsa(document, selector), selector);
    }

    // 类型判断
    function type (obj, type) {
      return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() === type;
    }

    // 对象的深拷贝
    function extend(target, source) {
      for(key in source) {
        target[key] = type(source[key], 'object') ? extend({}, source[key]) : source[key];
      }
      return target;
    }

    $.type = type;
    $.extend = extend;

    /**
     * @description 对节点集合封装的遍历函数
     * @param {arryLike} elements 
     * @param {回调函数} callback 
     */
    $.each = function(elements, callback) {
      for(var i = 0; i < elements.length; i++) {
        callback(elements[i], i);
      }

      return elements;
    }

    /**
     * @description 操作dom的一些方法
     */
    $.fn = {
      constructor: Z,

      // 封装一个遍历集合对象的方法each
      each: function(callback) {
        for(var i = 0; i < this.length; i++) {
          // 用call指定回调函数中this
          callback.call(this[i], i, this[i]);
        }
        return this;
      },

      // 举个栗子
      text: function(txt) {
        // 返回this 支持链式调用
        return this.each(function() {
          this.textContent = txt;
        });
      },

      // 举个栗子
      attr: function(name, value){
        this.each(function() {
          this.setAttribute(name, value);
        });
      }

      // ...
    }

    // 把Z的原型对象挂载在`$.fn`命名空间上
    Z.prototype = $.fn;

    return $;
  })();
  
  // 暴露内部接口
  global.Zp = global.$ = Zp;

  /**
   * @description 事件系统
   * @param {string} event 
   * @param {func} callback 
   */
  ;(function($) {
    $.fn.on = function(event, callback) {
      return this.each(function(_, element) {
        element.addEventListener(event, callback, false);
      });
    }
  })(Zp);
  
  /**
   * @description ajax系统
   */
  ;(function($) {
    function empty() {};

    // 序列化发送到服务器的data数据
    function serializeData(options){
      if (options.data && $.type(options.data) !== 'string')
        options.data = $.serialize(options.data);
      if (options.data && options.type.toUpperCase() === 'GET')
        options.url = options.url + '?' + options.data, options.data = null;
    }

    $.ajaxSettings = {
      // 默认请求类型
      type: 'GET',
      beforeSend: empty,
      success: empty,
      error: empty,
      // 请求完成的回调函数，包括success/error
      xhr: function() {
        return new window.XMLHttpRequest();
      }
    };

    $.ajax = function(options) {
      var settings = $.extend({}, options);
      for(key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key];
      if (!settings.url) settings.url = window.location.toString();
      serializeData();
      
      var xhr = $.ajaxSettings.xhr();
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          var result, error = false;
          if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
            var datatype = xhr.getResponseHeader('content-type');
            if (xhr.responseType == 'arraybuffer' || xhr.responseType == 'blob')
              result = xhr.response
            else {
              result = xhr.responseText

              try {
                // 只支持响应数据为json数据
                if ( datatype === 'json') result = JSON.parse(result);
              } catch(e) { error = e } 

              if (error) $.ajaxSettings.error(error);
            }

            $.ajaxSettings.success(result);
          }
        } else {
          $.ajaxSettings.error(xhr.statusText);
        }
      }

      // 设置异步请求
      var async = true;
      $.settings.beforeSend();
      xhr.open(settings.type, settings.url, async);

      // 只支持简单的表单数据类型
      if (settings.type.toUpperCase() !== 'GET') xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.send(settings.data || null);
    };

    $.get = function(options) {
      return $.ajax({type: 'GET'});
    }

    $.post = function(options) {
      return $.ajax({type: 'POST'});
    }

    // 把对象转换为URL编码的查询字符串的表示形式,只支持字段为简单的数据类型
    $.serialize = function(obj) {
      var param = [];
      for(var key in obj) param.push(encodeURIComponent(key), encodeURIComponent(obj[key]));
      return param.join('&')
    }
  })(Zp);
})(this);