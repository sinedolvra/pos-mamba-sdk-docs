var Button = (function () {
	'use strict';

	// https://infra.spec.whatwg.org/#noncharacter


	var invalidAttributeNameCharacter = /(?:[\t-\r "'\/=>\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFDD0-\uFDEF\uFEFF\uFFFE\uFFFF]|[\uD83F\uD87F\uD8BF\uD8FF\uD93F\uD97F\uD9BF\uD9FF\uDA3F\uDA7F\uDABF\uDAFF\uDB3F\uDB7F\uDBBF\uDBFF][\uDFFE\uDFFF])/;

	function spread(args) {
	  var attributes = Object.assign.apply(Object, [{}].concat(args));
	  var str = '';
	  Object.keys(attributes).forEach(function (name) {
	    if (invalidAttributeNameCharacter.test(name)) return;
	    var value = attributes[name];
	    if (value === undefined) return;
	    if (value === true) str += " " + name;
	    var escaped = String(value).replace(/"/g, '&#34;').replace(/'/g, '&#39;');
	    str += " " + name + "=" + JSON.stringify(escaped);
	  });
	  return str;
	}

	var escaped = {
	  '"': '&quot;',
	  "'": '&#39;',
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;'
	};

	function escape(html) {
	  return String(html).replace(/["'&<>]/g, function (match) {
	    return escaped[match];
	  });
	}

	function validateSsrComponent(component, name) {
	  if (!component || !component._render) {
	    if (name === 'svelte:component') name += ' this={...}';
	    throw new Error("<" + name + "> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules");
	  }

	  return component;
	}

	function style({ textColor, bgColor, width, borderColor }) {
	  return [
	    textColor && `color:${textColor}`,
	    bgColor && `background-color:${bgColor}`,
	    borderColor && `border: 2px solid ${borderColor}`,
	    width && `width:${width}`,
	  ]
	    .filter(Boolean)
	    .join(';');
	}
	function data() {
	  return {
	    /** Button size: regular | small | large | full */
	    size: 'regular',
	    /** Disable the button */
	    disabled: false,
	    /** Make the button fixed at the bottom of the screen */
	    bottom: false,
	    /** Text color */
	    textColor: '#fff',
	    /** Background color */
	    bgColor: '4ebf1a',
	    /** Border color */
	    borderColor: null,
	    width: null,
	  };
	}
	var Button = {};

	Button.filename = "/Users/jaimecostamarques/Workspace/pos-mamba-sdk-docs/node_modules/@mamba/button/Button.html";

	Button.data = function() {
		return data();
	};

	Button.render = function(state, options = {}) {
		var components = new Set();

		function addComponent(component) {
			components.add(component);
		}

		var result = { head: '', addComponent };
		var html = Button._render(result, state, options);

		var cssCode = Array.from(components).map(c => c.css && c.css.code).filter(Boolean).join('\n');

		return {
			html,
			head: result.head,
			css: { code: cssCode, map: null },
			toString() {
				return html;
			}
		};
	};

	Button._render = function(__result, ctx, options) {
		__result.addComponent(Button);

		ctx = Object.assign(data(), ctx);

		ctx.style = style(ctx);

		return `<button class="${[`button is-${escape(ctx.size)} svelte-168q4u3`, ctx.bottom ? "is-fixed" : ""].join(' ').trim() }"${(v => v == null ? "" : ` style="${escape(ctx.style)}"`)(ctx.style)}${ctx.disabled ? " disabled" : "" }>
  ${options && options.slotted && options.slotted.default ? options.slotted.default() : ``}
</button>`;
	};

	Button.css = {
		code: "button.svelte-168q4u3{min-height:38px;padding:0 16px;vertical-align:middle;color:#fff;background-color:#4ebf1a;font-size:13px;font-weight:bold;cursor:pointer;-webkit-appearance:none;appearance:none;border:none}button[disabled].svelte-168q4u3{cursor:not-allowed;background-color:#b5b5b5 !important;color:#757575 !important;border:none !important}button.is-fixed.svelte-168q4u3{position:fixed;bottom:0;left:0}button.is-small.svelte-168q4u3{font-size:14px;padding:0 18px;min-height:26px}button.is-large.svelte-168q4u3{font-size:18px;padding:0 36px;min-height:68px}button.is-full.svelte-168q4u3{width:100%}",
		map: "{\"version\":3,\"file\":\"Button.html\",\"sources\":[\"Button.html\"],\"sourcesContent\":[\"<button\\n  ref:button\\n  class=\\\"button is-{size}\\\"\\n  class:is-fixed=\\\"bottom\\\"\\n  {style}\\n  {disabled}\\n  on:click\\n>\\n  <slot></slot>\\n</button>\\n\\n<script>\\n  export default {\\n    data() {\\n      return {\\n        /** Button size: regular | small | large | full */\\n        size: 'regular',\\n        /** Disable the button */\\n        disabled: false,\\n        /** Make the button fixed at the bottom of the screen */\\n        bottom: false,\\n        /** Text color */\\n        textColor: '#fff',\\n        /** Background color */\\n        bgColor: '4ebf1a',\\n        /** Border color */\\n        borderColor: null,\\n        width: null,\\n      };\\n    },\\n    computed: {\\n      style({ textColor, bgColor, width, borderColor }) {\\n        return [\\n          textColor && `color:${textColor}`,\\n          bgColor && `background-color:${bgColor}`,\\n          borderColor && `border: 2px solid ${borderColor}`,\\n          width && `width:${width}`,\\n        ]\\n          .filter(Boolean)\\n          .join(';');\\n      },\\n    },\\n    oncreate() {\\n      if (this.options.data) {\\n        const { shortcut } = this.options.data;\\n        if (typeof shortcut !== 'undefined') {\\n          this.refs.button.setAttribute('shortcut', shortcut);\\n        }\\n      }\\n    },\\n    methods: {\\n      click() {\\n        this.refs.button.click();\\n      },\\n      focus() {\\n        this.refs.button.focus();\\n      },\\n    },\\n  };\\n</script>\\n\\n<style>/* --- */\\nbutton {\\n  min-height: 38px;\\n  /* padding: 10px 16px; */\\n  padding: 0 16px;\\n  vertical-align: middle;\\n  color: #fff;\\n  background-color: #4ebf1a;\\n  font-size: 13px;\\n  font-weight: bold;\\n  cursor: pointer;\\n  -webkit-appearance: none;\\n          appearance: none;\\n  border: none;\\n}\\nbutton[disabled] {\\n  cursor: not-allowed;\\n  /* stylelint-disable-next-line declaration-no-important */\\n  background-color: #b5b5b5 !important;\\n  /* stylelint-disable-next-line declaration-no-important */\\n  color: #757575 !important;\\n  /* stylelint-disable-next-line declaration-no-important */\\n  border: none !important;\\n}\\nbutton.is-fixed {\\n  position: fixed;\\n  bottom: 0;\\n  left: 0;\\n}\\nbutton.is-small {\\n  font-size: 14px;\\n  /* padding: 5px 18px; */\\n  padding: 0 18px;\\n  min-height: 26px;\\n}\\nbutton.is-large {\\n  font-size: 18px;\\n  /* padding: 20px 36px; */\\n  padding: 0 36px;\\n  min-height: 68px;\\n}\\nbutton.is-full {\\n  width: 100%;\\n}\\n</style>\\n\"],\"names\":[],\"mappings\":\"AA8DA,MAAM,eAAC,CAAC,AACN,UAAU,CAAE,IAAI,CAEhB,OAAO,CAAE,CAAC,CAAC,IAAI,CACf,cAAc,CAAE,MAAM,CACtB,KAAK,CAAE,IAAI,CACX,gBAAgB,CAAE,OAAO,CACzB,SAAS,CAAE,IAAI,CACf,WAAW,CAAE,IAAI,CACjB,MAAM,CAAE,OAAO,CACf,kBAAkB,CAAE,IAAI,CAChB,UAAU,CAAE,IAAI,CACxB,MAAM,CAAE,IAAI,AACd,CAAC,AACD,MAAM,CAAC,QAAQ,CAAC,eAAC,CAAC,AAChB,MAAM,CAAE,WAAW,CAEnB,gBAAgB,CAAE,OAAO,CAAC,UAAU,CAEpC,KAAK,CAAE,OAAO,CAAC,UAAU,CAEzB,MAAM,CAAE,IAAI,CAAC,UAAU,AACzB,CAAC,AACD,MAAM,SAAS,eAAC,CAAC,AACf,QAAQ,CAAE,KAAK,CACf,MAAM,CAAE,CAAC,CACT,IAAI,CAAE,CAAC,AACT,CAAC,AACD,MAAM,SAAS,eAAC,CAAC,AACf,SAAS,CAAE,IAAI,CAEf,OAAO,CAAE,CAAC,CAAC,IAAI,CACf,UAAU,CAAE,IAAI,AAClB,CAAC,AACD,MAAM,SAAS,eAAC,CAAC,AACf,SAAS,CAAE,IAAI,CAEf,OAAO,CAAE,CAAC,CAAC,IAAI,CACf,UAAU,CAAE,IAAI,AAClB,CAAC,AACD,MAAM,QAAQ,eAAC,CAAC,AACd,KAAK,CAAE,IAAI,AACb,CAAC\"}"
	};

	function _props({ symbol, size, level }) {
	  return {
	    symbol,
	    size,
	    level,
	  };
	}
	function style$1({ src, color, width, height }) {
	  return [
	    color && `background-color: ${color}`,
	    /* istanbul ignore next */
	    src && `-webkit-mask-image: url(${src})`,
	    width && `width: ${width}`,
	    height && `height: ${height}`,
	  ]
	    .filter(Boolean)
	    .join(';');
	}
	function data$1() {
	  return {
	    size: 'normal',
	    symbol: 'custom',
	    src: undefined,
	    color: undefined,
	    level: undefined,
	    width: undefined,
	    height: undefined,
	  };
	}
	var Icon = {};

	Icon.filename = "/Users/jaimecostamarques/Workspace/pos-mamba-sdk-docs/node_modules/@mamba/icon/Icon.html";

	Icon.data = function() {
		return data$1();
	};

	Icon.render = function(state, options = {}) {
		var components = new Set();

		function addComponent(component) {
			components.add(component);
		}

		var result = { head: '', addComponent };
		var html = Icon._render(result, state, options);

		var cssCode = Array.from(components).map(c => c.css && c.css.code).filter(Boolean).join('\n');

		return {
			html,
			head: result.head,
			css: { code: cssCode, map: null },
			toString() {
				return html;
			}
		};
	};

	Icon._render = function(__result, ctx, options) {
		__result.addComponent(Icon);

		ctx = Object.assign(data$1(), ctx);

		ctx._props = _props(ctx);
		ctx.style = style$1(ctx);

		return `<div${spread([{ class: `icon svelte-1oeejpt` }, { style: `${escape(ctx.style)}` }, ctx._props])}>
</div>`;
	};

	Icon.css = {
		code: "[symbol='account'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/account.svg);mask-image:url(./assets/icons/account.svg)}[symbol='alert'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/alert.svg);mask-image:url(./assets/icons/alert.svg)}[symbol='autorenew'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/autorenew.svg);mask-image:url(./assets/icons/autorenew.svg)}[symbol='bookmark'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/bookmark.svg);mask-image:url(./assets/icons/bookmark.svg)}[symbol='calendar'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/calendar.svg);mask-image:url(./assets/icons/calendar.svg)}[symbol='check'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/check.svg);mask-image:url(./assets/icons/check.svg)}[symbol='chevron-down'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/chevron-down.svg);mask-image:url(./assets/icons/chevron-down.svg)}[symbol='chevron-left'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/chevron-left.svg);mask-image:url(./assets/icons/chevron-left.svg)}[symbol='chevron-right'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/chevron-right.svg);mask-image:url(./assets/icons/chevron-right.svg)}[symbol='chevron-up'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/chevron-up.svg);mask-image:url(./assets/icons/chevron-up.svg)}[symbol='close-circle'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/close-circle.svg);mask-image:url(./assets/icons/close-circle.svg)}[symbol='close'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/close.svg);mask-image:url(./assets/icons/close.svg)}[symbol='credit-card'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/credit-card.svg);mask-image:url(./assets/icons/credit-card.svg)}[symbol='delete'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/delete.svg);mask-image:url(./assets/icons/delete.svg)}[symbol='eye-off'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/eye-off.svg);mask-image:url(./assets/icons/eye-off.svg)}[symbol='eye'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/eye.svg);mask-image:url(./assets/icons/eye.svg)}[symbol='floppy'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/floppy.svg);mask-image:url(./assets/icons/floppy.svg)}[symbol='heart'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/heart.svg);mask-image:url(./assets/icons/heart.svg)}[symbol='help-circle'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/help-circle.svg);mask-image:url(./assets/icons/help-circle.svg)}[symbol='app-home'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/app-home.svg);mask-image:url(./assets/icons/app-home.svg)}[symbol='home'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/home.svg);mask-image:url(./assets/icons/home.svg)}[symbol='information'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/information.svg);mask-image:url(./assets/icons/information.svg)}[symbol='lock-open'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/lock-open.svg);mask-image:url(./assets/icons/lock-open.svg)}[symbol='lock-stn-open'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/lock-stn-open.svg);mask-image:url(./assets/icons/lock-stn-open.svg)}[symbol='lock-stn'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/lock-stn.svg);mask-image:url(./assets/icons/lock-stn.svg)}[symbol='lock'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/lock.svg);mask-image:url(./assets/icons/lock.svg)}[symbol='loop'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/loop.svg);mask-image:url(./assets/icons/loop.svg)}[symbol='menu'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/menu.svg);mask-image:url(./assets/icons/menu.svg)}[symbol='pencil'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/pencil.svg);mask-image:url(./assets/icons/pencil.svg)}[symbol='plus'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/plus.svg);mask-image:url(./assets/icons/plus.svg)}[symbol='printer-outline'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/printer-outline.svg);mask-image:url(./assets/icons/printer-outline.svg)}[symbol='printer'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/printer.svg);mask-image:url(./assets/icons/printer.svg)}[symbol='refresh'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/refresh.svg);mask-image:url(./assets/icons/refresh.svg)}[symbol='settings'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/settings.svg);mask-image:url(./assets/icons/settings.svg)}[symbol='signal-2g'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/signal-2g.svg);mask-image:url(./assets/icons/signal-2g.svg)}[symbol='signal-3g'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/signal-3g.svg);mask-image:url(./assets/icons/signal-3g.svg)}[symbol='signal-4g'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/signal-4g.svg);mask-image:url(./assets/icons/signal-4g.svg)}[symbol='signal-hspa-plus'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/signal-hspa-plus.svg);mask-image:url(./assets/icons/signal-hspa-plus.svg)}[symbol='signal-hspa'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/signal-hspa.svg);mask-image:url(./assets/icons/signal-hspa.svg)}[symbol='signal-variant'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/signal-variant.svg);mask-image:url(./assets/icons/signal-variant.svg)}[symbol='signal'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/signal.svg);mask-image:url(./assets/icons/signal.svg)}[symbol='star-outline'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/star-outline.svg);mask-image:url(./assets/icons/star-outline.svg)}[symbol='star'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/star.svg);mask-image:url(./assets/icons/star.svg)}[symbol='wifi'].svelte-1oeejpt{-webkit-mask-image:url(./assets/icons/wifi.svg);mask-image:url(./assets/icons/wifi.svg)}.icon.svelte-1oeejpt{display:inline-block;vertical-align:middle;width:24px;height:24px;background-color:#494949;-webkit-mask-size:cover;mask-size:cover;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center}[size='large'].svelte-1oeejpt{width:36px;height:36px}[size='giant'].svelte-1oeejpt{width:56px;height:56px}[level='0'].svelte-1oeejpt{background-color:#494949}[symbol='wifi'][level='1'].svelte-1oeejpt{background:-webkit-gradient(linear, left top, left bottom, color-stop(60%, #b5b5b5), color-stop(0%, #494949));background:linear-gradient(to bottom, #b5b5b5 60%, #494949 0%)}[symbol='wifi'][level='2'].svelte-1oeejpt{background:-webkit-gradient(linear, left top, left bottom, color-stop(37%, #b5b5b5), color-stop(0%, #494949));background:linear-gradient(to bottom, #b5b5b5 37%, #494949 0%)}",
		map: "{\"version\":3,\"file\":\"Icon.html\",\"sources\":[\"Icon.html\"],\"sourcesContent\":[\"<div\\n  ref:icon\\n  class=\\\"icon\\\"\\n  {style}\\n  {..._props}\\n  on:click>\\n</div>\\n\\n<script>\\n  export default {\\n    data() {\\n      return {\\n        size: 'normal',\\n        symbol: 'custom',\\n        src: undefined,\\n        color: undefined,\\n        level: undefined,\\n        width: undefined,\\n        height: undefined,\\n      };\\n    },\\n    computed: {\\n      _props({ symbol, size, level }) {\\n        return {\\n          symbol,\\n          size,\\n          level,\\n        };\\n      },\\n      style({ src, color, width, height }) {\\n        return [\\n          color && `background-color: ${color}`,\\n          /* istanbul ignore next */\\n          src && `-webkit-mask-image: url(${src})`,\\n          width && `width: ${width}`,\\n          height && `height: ${height}`,\\n        ]\\n          .filter(Boolean)\\n          .join(';');\\n      },\\n    },\\n  };\\n</script>\\n\\n<style>\\n  [symbol='account'] {\\n    -webkit-mask-image: url(./assets/icons/account.svg);\\n            mask-image: url(./assets/icons/account.svg);\\n  }\\n  [symbol='alert'] {\\n    -webkit-mask-image: url(./assets/icons/alert.svg);\\n            mask-image: url(./assets/icons/alert.svg);\\n  }\\n  [symbol='autorenew'] {\\n    -webkit-mask-image: url(./assets/icons/autorenew.svg);\\n            mask-image: url(./assets/icons/autorenew.svg);\\n  }\\n  [symbol='bookmark'] {\\n    -webkit-mask-image: url(./assets/icons/bookmark.svg);\\n            mask-image: url(./assets/icons/bookmark.svg);\\n  }\\n  [symbol='calendar'] {\\n    -webkit-mask-image: url(./assets/icons/calendar.svg);\\n            mask-image: url(./assets/icons/calendar.svg);\\n  }\\n  [symbol='check'] {\\n    -webkit-mask-image: url(./assets/icons/check.svg);\\n            mask-image: url(./assets/icons/check.svg);\\n  }\\n  [symbol='chevron-down'] {\\n    -webkit-mask-image: url(./assets/icons/chevron-down.svg);\\n            mask-image: url(./assets/icons/chevron-down.svg);\\n  }\\n  [symbol='chevron-left'] {\\n    -webkit-mask-image: url(./assets/icons/chevron-left.svg);\\n            mask-image: url(./assets/icons/chevron-left.svg);\\n  }\\n  [symbol='chevron-right'] {\\n    -webkit-mask-image: url(./assets/icons/chevron-right.svg);\\n            mask-image: url(./assets/icons/chevron-right.svg);\\n  }\\n  [symbol='chevron-up'] {\\n    -webkit-mask-image: url(./assets/icons/chevron-up.svg);\\n            mask-image: url(./assets/icons/chevron-up.svg);\\n  }\\n  [symbol='close-circle'] {\\n    -webkit-mask-image: url(./assets/icons/close-circle.svg);\\n            mask-image: url(./assets/icons/close-circle.svg);\\n  }\\n  [symbol='close'] {\\n    -webkit-mask-image: url(./assets/icons/close.svg);\\n            mask-image: url(./assets/icons/close.svg);\\n  }\\n  [symbol='credit-card'] {\\n    -webkit-mask-image: url(./assets/icons/credit-card.svg);\\n            mask-image: url(./assets/icons/credit-card.svg);\\n  }\\n  [symbol='delete'] {\\n    -webkit-mask-image: url(./assets/icons/delete.svg);\\n            mask-image: url(./assets/icons/delete.svg);\\n  }\\n  [symbol='eye-off'] {\\n    -webkit-mask-image: url(./assets/icons/eye-off.svg);\\n            mask-image: url(./assets/icons/eye-off.svg);\\n  }\\n  [symbol='eye'] {\\n    -webkit-mask-image: url(./assets/icons/eye.svg);\\n            mask-image: url(./assets/icons/eye.svg);\\n  }\\n  [symbol='floppy'] {\\n    -webkit-mask-image: url(./assets/icons/floppy.svg);\\n            mask-image: url(./assets/icons/floppy.svg);\\n  }\\n  [symbol='heart'] {\\n    -webkit-mask-image: url(./assets/icons/heart.svg);\\n            mask-image: url(./assets/icons/heart.svg);\\n  }\\n  [symbol='help-circle'] {\\n    -webkit-mask-image: url(./assets/icons/help-circle.svg);\\n            mask-image: url(./assets/icons/help-circle.svg);\\n  }\\n  [symbol='app-home'] {\\n    -webkit-mask-image: url(./assets/icons/app-home.svg);\\n            mask-image: url(./assets/icons/app-home.svg);\\n  }\\n  [symbol='home'] {\\n    -webkit-mask-image: url(./assets/icons/home.svg);\\n            mask-image: url(./assets/icons/home.svg);\\n  }\\n  [symbol='information'] {\\n    -webkit-mask-image: url(./assets/icons/information.svg);\\n            mask-image: url(./assets/icons/information.svg);\\n  }\\n  [symbol='lock-open'] {\\n    -webkit-mask-image: url(./assets/icons/lock-open.svg);\\n            mask-image: url(./assets/icons/lock-open.svg);\\n  }\\n  [symbol='lock-stn-open'] {\\n    -webkit-mask-image: url(./assets/icons/lock-stn-open.svg);\\n            mask-image: url(./assets/icons/lock-stn-open.svg);\\n  }\\n  [symbol='lock-stn'] {\\n    -webkit-mask-image: url(./assets/icons/lock-stn.svg);\\n            mask-image: url(./assets/icons/lock-stn.svg);\\n  }\\n  [symbol='lock'] {\\n    -webkit-mask-image: url(./assets/icons/lock.svg);\\n            mask-image: url(./assets/icons/lock.svg);\\n  }\\n  [symbol='loop'] {\\n    -webkit-mask-image: url(./assets/icons/loop.svg);\\n            mask-image: url(./assets/icons/loop.svg);\\n  }\\n  [symbol='menu'] {\\n    -webkit-mask-image: url(./assets/icons/menu.svg);\\n            mask-image: url(./assets/icons/menu.svg);\\n  }\\n  [symbol='pencil'] {\\n    -webkit-mask-image: url(./assets/icons/pencil.svg);\\n            mask-image: url(./assets/icons/pencil.svg);\\n  }\\n  [symbol='plus'] {\\n    -webkit-mask-image: url(./assets/icons/plus.svg);\\n            mask-image: url(./assets/icons/plus.svg);\\n  }\\n  [symbol='printer-outline'] {\\n    -webkit-mask-image: url(./assets/icons/printer-outline.svg);\\n            mask-image: url(./assets/icons/printer-outline.svg);\\n  }\\n  [symbol='printer'] {\\n    -webkit-mask-image: url(./assets/icons/printer.svg);\\n            mask-image: url(./assets/icons/printer.svg);\\n  }\\n  [symbol='refresh'] {\\n    -webkit-mask-image: url(./assets/icons/refresh.svg);\\n            mask-image: url(./assets/icons/refresh.svg);\\n  }\\n  [symbol='settings'] {\\n    -webkit-mask-image: url(./assets/icons/settings.svg);\\n            mask-image: url(./assets/icons/settings.svg);\\n  }\\n  [symbol='signal-2g'] {\\n    -webkit-mask-image: url(./assets/icons/signal-2g.svg);\\n            mask-image: url(./assets/icons/signal-2g.svg);\\n  }\\n  [symbol='signal-3g'] {\\n    -webkit-mask-image: url(./assets/icons/signal-3g.svg);\\n            mask-image: url(./assets/icons/signal-3g.svg);\\n  }\\n  [symbol='signal-4g'] {\\n    -webkit-mask-image: url(./assets/icons/signal-4g.svg);\\n            mask-image: url(./assets/icons/signal-4g.svg);\\n  }\\n  [symbol='signal-hspa-plus'] {\\n    -webkit-mask-image: url(./assets/icons/signal-hspa-plus.svg);\\n            mask-image: url(./assets/icons/signal-hspa-plus.svg);\\n  }\\n  [symbol='signal-hspa'] {\\n    -webkit-mask-image: url(./assets/icons/signal-hspa.svg);\\n            mask-image: url(./assets/icons/signal-hspa.svg);\\n  }\\n  [symbol='signal-variant'] {\\n    -webkit-mask-image: url(./assets/icons/signal-variant.svg);\\n            mask-image: url(./assets/icons/signal-variant.svg);\\n  }\\n  [symbol='signal'] {\\n    -webkit-mask-image: url(./assets/icons/signal.svg);\\n            mask-image: url(./assets/icons/signal.svg);\\n  }\\n  [symbol='star-outline'] {\\n    -webkit-mask-image: url(./assets/icons/star-outline.svg);\\n            mask-image: url(./assets/icons/star-outline.svg);\\n  }\\n  [symbol='star'] {\\n    -webkit-mask-image: url(./assets/icons/star.svg);\\n            mask-image: url(./assets/icons/star.svg);\\n  }\\n  [symbol='wifi'] {\\n    -webkit-mask-image: url(./assets/icons/wifi.svg);\\n            mask-image: url(./assets/icons/wifi.svg);\\n  }\\n\\n.icon {\\n  display: inline-block;\\n  vertical-align: middle;\\n  width: 24px;\\n  height: 24px;\\n  background-color: #494949;\\n  -webkit-mask-size: cover;\\n          mask-size: cover;\\n  -webkit-mask-repeat: no-repeat;\\n          mask-repeat: no-repeat;\\n  -webkit-mask-position: center;\\n          mask-position: center;\\n}\\n\\n[size='large'] {\\n  width: 36px;\\n  height: 36px;\\n}\\n\\n[size='giant'] {\\n  width: 56px;\\n  height: 56px;\\n}\\n\\n[level='0'] {\\n  background-color: #494949;\\n}\\n\\n[symbol='wifi'][level='1'] {\\n  background: -webkit-gradient(linear, left top, left bottom, color-stop(60%, #b5b5b5), color-stop(0%, #494949));\\n  background: linear-gradient(to bottom, #b5b5b5 60%, #494949 0%);\\n}\\n\\n[symbol='wifi'][level='2'] {\\n  background: -webkit-gradient(linear, left top, left bottom, color-stop(37%, #b5b5b5), color-stop(0%, #494949));\\n  background: linear-gradient(to bottom, #b5b5b5 37%, #494949 0%);\\n}\\n</style>\\n\"],\"names\":[],\"mappings\":\"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\"}"
	};

	var Example = {};

	Example.filename = "/Users/jaimecostamarques/Workspace/pos-mamba-sdk-docs/packages/components/Button/example/Example.html";

	Example.data = function() {
		return {};
	};

	Example.render = function(state, options = {}) {
		var components = new Set();

		function addComponent(component) {
			components.add(component);
		}

		var result = { head: '', addComponent };
		var html = Example._render(result, state, options);

		var cssCode = Array.from(components).map(c => c.css && c.css.code).filter(Boolean).join('\n');

		return {
			html,
			head: result.head,
			css: { code: cssCode, map: null },
			toString() {
				return html;
			}
		};
	};

	Example._render = function(__result, ctx, options) {
		__result.addComponent(Example);

		ctx = Object.assign({}, ctx);

		return `<div class="container svelte-vtcan8">
  <h4 class="svelte-vtcan8">Padrão</h4>
  <div class="row svelte-vtcan8">
    ${validateSsrComponent(Button, 'Button')._render(__result, {  }, { store: options.store, slotted: { default: () => `Label` } })}
  </div>

  <h4 class="svelte-vtcan8">Desativado</h4>
  <div class="row svelte-vtcan8">
    ${validateSsrComponent(Button, 'Button')._render(__result, { disabled: true }, { store: options.store, slotted: { default: () => `Label` } })}
  </div>

  <h4 class="svelte-vtcan8">Tamanhos</h4>
  <div class="row svelte-vtcan8">
    <div class="group">
      ${validateSsrComponent(Button, 'Button')._render(__result, { size: "small" }, { store: options.store, slotted: { default: () => `Label` } })}
      ${validateSsrComponent(Button, 'Button')._render(__result, {  }, { store: options.store, slotted: { default: () => `Label` } })}
      ${validateSsrComponent(Button, 'Button')._render(__result, { size: "large" }, { store: options.store, slotted: { default: () => `Label` } })}
    </div>
  </div>

  <h4 class="svelte-vtcan8">Custom width button</h4>
  <div class="row svelte-vtcan8">
    ${validateSsrComponent(Button, 'Button')._render(__result, { width: "33%" }, { store: options.store, slotted: { default: () => `Label` } })}
  </div>

  <h4 class="svelte-vtcan8">Personalizado</h4>
  <div class="row svelte-vtcan8">
    ${validateSsrComponent(Button, 'Button')._render(__result, { textColor: "white", bgColor: "black" }, { store: options.store, slotted: { default: () => `Label` } })}
     ${validateSsrComponent(Button, 'Button')._render(__result, {  }, { store: options.store, slotted: { default: () => `
      ${validateSsrComponent(Icon, 'Icon')._render(__result, { symbol: "chevron-right", color: "white" }, { store: options.store })}
    ` } })}
  </div>

</div>`;
	};

	Example.css = {
		code: "body{background-color:#ddd}h4.svelte-vtcan8{display:inline-block;vertical-align:middle;font-weight:bold}.container.svelte-vtcan8{max-width:80%;width:700px;margin:80px auto}.row.svelte-vtcan8{margin:20px 0px 20px 0px}",
		map: "{\"version\":3,\"file\":\"Example.html\",\"sources\":[\"Example.html\"],\"sourcesContent\":[\"<div class=\\\"container\\\">\\n  <h4>Padrão</h4>\\n  <div class=\\\"row\\\">\\n    <Button on:click=\\\"console.log(event)\\\">Label</Button>\\n  </div>\\n\\n  <h4>Desativado</h4>\\n  <div class=\\\"row\\\">\\n    <Button on:click=\\\"console.log(event)\\\" disabled>Label</Button>\\n  </div>\\n\\n  <h4>Tamanhos</h4>\\n  <div class=\\\"row\\\">\\n    <div class=\\\"group\\\">\\n      <Button on:click=\\\"console.log(event)\\\" size=\\\"small\\\">Label</Button>\\n      <Button on:click=\\\"console.log(event)\\\">Label</Button>\\n      <Button on:click=\\\"console.log(event)\\\" size=\\\"large\\\">Label</Button>\\n    </div>\\n  </div>\\n\\n  <h4>Custom width button</h4>\\n  <div class=\\\"row\\\">\\n    <Button on:click=\\\"console.log(event)\\\" width=\\\"33%\\\">Label</Button>\\n  </div>\\n\\n  <h4>Personalizado</h4>\\n  <div class=\\\"row\\\">\\n    <Button on:click=\\\"console.log(event)\\\" textColor=\\\"white\\\" bgColor=\\\"black\\\">Label</Button>\\n     <Button>\\n      <Icon symbol=\\\"chevron-right\\\" color=\\\"white\\\"/>\\n    </Button>\\n  </div>\\n\\n</div>\\n\\n<style>\\n:global(body) {\\n  background-color: #ddd;\\n}\\n\\nh4 {\\n  display: inline-block;\\n  vertical-align: middle;\\n  font-weight: bold;\\n}\\n\\n.container {\\n  max-width: 80%;\\n  width: 700px;\\n  margin: 80px auto;\\n}\\n\\n.row {\\n  margin: 20px 0px 20px 0px;\\n}\\n</style>\\n\\n<script>\\n  export default {\\n    components: {\\n      Button: '@mamba/button/Button.html',\\n      Icon: '@mamba/icon',\\n    },\\n  };\\n</script>\\n\"],\"names\":[],\"mappings\":\"AAoCQ,IAAI,AAAE,CAAC,AACb,gBAAgB,CAAE,IAAI,AACxB,CAAC,AAED,EAAE,cAAC,CAAC,AACF,OAAO,CAAE,YAAY,CACrB,cAAc,CAAE,MAAM,CACtB,WAAW,CAAE,IAAI,AACnB,CAAC,AAED,UAAU,cAAC,CAAC,AACV,SAAS,CAAE,GAAG,CACd,KAAK,CAAE,KAAK,CACZ,MAAM,CAAE,IAAI,CAAC,IAAI,AACnB,CAAC,AAED,IAAI,cAAC,CAAC,AACJ,MAAM,CAAE,IAAI,CAAC,GAAG,CAAC,IAAI,CAAC,GAAG,AAC3B,CAAC\"}"
	};

	return Example;

}());
