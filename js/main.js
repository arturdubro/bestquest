! function(t, e) {
  function i() {
    return new Date(Date.UTC.apply(Date, arguments))
  }

  function n() {
    var t = new Date;
    return i(t.getFullYear(), t.getMonth(), t.getDate())
  }

  function a(t) {
    return function() {
      return this[t].apply(this, arguments)
    }
  }

  function s(e, i) {
    function n(t, e) {
      return e.toLowerCase()
    }
    var a, s = t(e).data(),
      r = {},
      o = new RegExp("^" + i.toLowerCase() + "([A-Z])");
    i = new RegExp("^" + i.toLowerCase());
    for (var l in s) i.test(l) && (a = l.replace(o, n), r[a] = s[l]);
    return r
  }

  function r(e) {
    var i = {};
    if (p[e] || (e = e.split("-")[0], p[e])) {
      var n = p[e];
      return t.each(f, function(t, e) {
        e in n && (i[e] = n[e])
      }), i
    }
  }
  var o = t(window),
    l = function() {
      var e = {
        get: function(t) {
          return this.slice(t)[0]
        },
        contains: function(t) {
          for (var e = t && t.valueOf(), i = 0, n = this.length; n > i; i++)
            if (this[i].valueOf() === e) return i;
          return -1
        },
        remove: function(t) {
          this.splice(t, 1)
        },
        replace: function(e) {
          e && (t.isArray(e) || (e = [e]), this.clear(), this.push.apply(this, e))
        },
        clear: function() {
          this.length = 0
        },
        copy: function() {
          var t = new l;
          return t.replace(this), t
        }
      };
      return function() {
        var i = [];
        return i.push.apply(i, arguments), t.extend(i, e), i
      }
    }(),
    h = function(e, i) {
      this.dates = new l, this.viewDate = n(), this.focusDate = null, this._process_options(i), this.element = t(e), this.isInline = !1, this.isInput = this.element.is("input"), this.component = this.element.is(".date") ? this.element.find(".add-on, .input-group-addon, .btn") : !1, this.hasInput = this.component && this.element.find("input").length, this.component && 0 === this.component.length && (this.component = !1), this.picker = t(g.template), this._buildEvents(), this._attachEvents(), this.isInline ? this.picker.addClass("datepicker-inline").appendTo(this.element) : this.picker.addClass("datepicker-dropdown dropdown-menu"), this.o.rtl && this.picker.addClass("datepicker-rtl"), this.viewMode = this.o.startView, this.o.calendarWeeks && this.picker.find("tfoot th.today, tfoot th.clear").attr("colspan", function(t, e) {
        return parseInt(e) + 1
      }), this._allow_update = !1, this.setStartDate(this._o.startDate), this.setEndDate(this._o.endDate), this.setDaysOfWeekDisabled(this.o.daysOfWeekDisabled), this.fillDow(), this.fillMonths(), this._allow_update = !0, this.update(), this.showMode(), this.isInline && this.show()
    };
  h.prototype = {
    constructor: h,
    _process_options: function(e) {
      this._o = t.extend({}, this._o, e);
      var i = this.o = t.extend({}, this._o),
        n = i.language;
      switch (p[n] || (n = n.split("-")[0], p[n] || (n = u.language)), i.language = n, i.startView) {
        case 2:
        case "decade":
          i.startView = 2;
          break;
        case 1:
        case "year":
          i.startView = 1;
          break;
        default:
          i.startView = 0
      }
      switch (i.minViewMode) {
        case 1:
        case "months":
          i.minViewMode = 1;
          break;
        case 2:
        case "years":
          i.minViewMode = 2;
          break;
        default:
          i.minViewMode = 0
      }
      i.startView = Math.max(i.startView, i.minViewMode), i.multidate !== !0 && (i.multidate = Number(i.multidate) || !1, i.multidate = i.multidate !== !1 ? Math.max(0, i.multidate) : 1), i.multidateSeparator = String(i.multidateSeparator), i.weekStart %= 7, i.weekEnd = (i.weekStart + 6) % 7;
      var a = g.parseFormat(i.format);
      i.startDate !== -1 / 0 && (i.startDate = i.startDate ? i.startDate instanceof Date ? this._local_to_utc(this._zero_time(i.startDate)) : g.parseDate(i.startDate, a, i.language) : -1 / 0), 1 / 0 !== i.endDate && (i.endDate = i.endDate ? i.endDate instanceof Date ? this._local_to_utc(this._zero_time(i.endDate)) : g.parseDate(i.endDate, a, i.language) : 1 / 0), i.daysOfWeekDisabled = i.daysOfWeekDisabled || [], t.isArray(i.daysOfWeekDisabled) || (i.daysOfWeekDisabled = i.daysOfWeekDisabled.split(/[,\s]*/)), i.daysOfWeekDisabled = t.map(i.daysOfWeekDisabled, function(t) {
        return parseInt(t, 10)
      });
      var s = String(i.orientation).toLowerCase().split(/\s+/g),
        r = i.orientation.toLowerCase();
      if (s = t.grep(s, function(t) {
          return /^auto|left|right|top|bottom$/.test(t)
        }), i.orientation = {
          x: "auto",
          y: "auto"
        }, r && "auto" !== r)
        if (1 === s.length) switch (s[0]) {
          case "top":
          case "bottom":
            i.orientation.y = s[0];
            break;
          case "left":
          case "right":
            i.orientation.x = s[0]
        } else r = t.grep(s, function(t) {
          return /^left|right$/.test(t)
        }), i.orientation.x = r[0] || "auto", r = t.grep(s, function(t) {
          return /^top|bottom$/.test(t)
        }), i.orientation.y = r[0] || "auto";
        else;
    },
    _events: [],
    _secondaryEvents: [],
    _applyEvents: function(t) {
      for (var i, n, a, s = 0; s < t.length; s++) i = t[s][0], 2 === t[s].length ? (n = e, a = t[s][1]) : 3 === t[s].length && (n = t[s][1], a = t[s][2]), i.on(a, n)
    },
    _unapplyEvents: function(t) {
      for (var i, n, a, s = 0; s < t.length; s++) i = t[s][0], 2 === t[s].length ? (a = e, n = t[s][1]) : 3 === t[s].length && (a = t[s][1], n = t[s][2]), i.off(n, a)
    },
    _buildEvents: function() {
      this.isInput ? this._events = [
        [this.element, {
          focus: t.proxy(this.show, this),
          keyup: t.proxy(function(e) {
            -1 === t.inArray(e.keyCode, [27, 37, 39, 38, 40, 32, 13, 9]) && this.update()
          }, this),
          keydown: t.proxy(this.keydown, this)
        }]
      ] : this.component && this.hasInput ? this._events = [
        [this.element.find("input"), {
          focus: t.proxy(this.show, this),
          keyup: t.proxy(function(e) {
            -1 === t.inArray(e.keyCode, [27, 37, 39, 38, 40, 32, 13, 9]) && this.update()
          }, this),
          keydown: t.proxy(this.keydown, this)
        }],
        [this.component, {
          click: t.proxy(this.show, this)
        }]
      ] : this.element.is("div") ? this.isInline = !0 : this._events = [
        [this.element, {
          click: t.proxy(this.show, this)
        }]
      ], this._events.push([this.element, "*", {
        blur: t.proxy(function(t) {
          this._focused_from = t.target
        }, this)
      }], [this.element, {
        blur: t.proxy(function(t) {
          this._focused_from = t.target
        }, this)
      }]), this._secondaryEvents = [
        [this.picker, {
          click: t.proxy(this.click, this)
        }],
        [t(window), {
          resize: t.proxy(this.place, this)
        }],
        [t(document), {
          "mousedown touchstart": t.proxy(function(t) {
            this.element.is(t.target) || this.element.find(t.target).length || this.picker.is(t.target) || this.picker.find(t.target).length || this.hide()
          }, this)
        }]
      ]
    },
    _attachEvents: function() {
      this._detachEvents(), this._applyEvents(this._events)
    },
    _detachEvents: function() {
      this._unapplyEvents(this._events)
    },
    _attachSecondaryEvents: function() {
      this._detachSecondaryEvents(), this._applyEvents(this._secondaryEvents)
    },
    _detachSecondaryEvents: function() {
      this._unapplyEvents(this._secondaryEvents)
    },
    _trigger: function(e, i) {
      var n = i || this.dates.get(-1),
        a = this._utc_to_local(n);
      this.element.trigger({
        type: e,
        date: a,
        dates: t.map(this.dates, this._utc_to_local),
        format: t.proxy(function(t, e) {
          0 === arguments.length ? (t = this.dates.length - 1, e = this.o.format) : "string" == typeof t && (e = t, t = this.dates.length - 1), e = e || this.o.format;
          var i = this.dates.get(t);
          return g.formatDate(i, e, this.o.language)
        }, this)
      })
    },
    show: function() {
      this.isInline || this.picker.appendTo("body"), this.picker.show(), this.place(), this._attachSecondaryEvents(), this._trigger("show")
    },
    hide: function() {
      this.isInline || this.picker.is(":visible") && (this.focusDate = null, this.picker.hide().detach(), this._detachSecondaryEvents(), this.viewMode = this.o.startView, this.showMode(), this.o.forceParse && (this.isInput && this.element.val() || this.hasInput && this.element.find("input").val()) && this.setValue(), this._trigger("hide"))
    },
    remove: function() {
      this.hide(), this._detachEvents(), this._detachSecondaryEvents(), this.picker.remove(), delete this.element.data().datepicker, this.isInput || delete this.element.data().date
    },
    _utc_to_local: function(t) {
      return t && new Date(t.getTime() + 6e4 * t.getTimezoneOffset())
    },
    _local_to_utc: function(t) {
      return t && new Date(t.getTime() - 6e4 * t.getTimezoneOffset())
    },
    _zero_time: function(t) {
      return t && new Date(t.getFullYear(), t.getMonth(), t.getDate())
    },
    _zero_utc_time: function(t) {
      return t && new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()))
    },
    getDates: function() {
      return t.map(this.dates, this._utc_to_local)
    },
    getUTCDates: function() {
      return t.map(this.dates, function(t) {
        return new Date(t)
      })
    },
    getDate: function() {
      return this._utc_to_local(this.getUTCDate())
    },
    getUTCDate: function() {
      return new Date(this.dates.get(-1))
    },
    setDates: function() {
      var e = t.isArray(arguments[0]) ? arguments[0] : arguments;
      this.update.apply(this, e), this._trigger("changeDate"), this.setValue()
    },
    setUTCDates: function() {
      var e = t.isArray(arguments[0]) ? arguments[0] : arguments;
      this.update.apply(this, t.map(e, this._utc_to_local)), this._trigger("changeDate"), this.setValue()
    },
    setDate: a("setDates"),
    setUTCDate: a("setUTCDates"),
    setValue: function() {
      var t = this.getFormattedDate();
      this.isInput ? this.element.val(t).change() : this.component && this.element.find("input").val(t).change()
    },
    getFormattedDate: function(i) {
      i === e && (i = this.o.format);
      var n = this.o.language;
      return t.map(this.dates, function(t) {
        return g.formatDate(t, i, n)
      }).join(this.o.multidateSeparator)
    },
    setStartDate: function(t) {
      this._process_options({
        startDate: t
      }), this.update(), this.updateNavArrows()
    },
    setEndDate: function(t) {
      this._process_options({
        endDate: t
      }), this.update(), this.updateNavArrows()
    },
    setDaysOfWeekDisabled: function(t) {
      this._process_options({
        daysOfWeekDisabled: t
      }), this.update(), this.updateNavArrows()
    },
    place: function() {
      if (!this.isInline) {
        var e = this.picker.outerWidth(),
          i = this.picker.outerHeight(),
          n = 10,
          a = o.width(),
          s = o.height(),
          r = o.scrollTop(),
          l = [];
        this.element.parents().each(function() {
          var e = t(this).css("z-index");
          "auto" !== e && 0 !== e && l.push(parseInt(e))
        });
        var h = Math.max.apply(Math, l) + 10,
          c = this.component ? this.component.parent().offset() : this.element.offset(),
          d = this.component ? this.component.outerHeight(!0) : this.element.outerHeight(!1),
          u = this.component ? this.component.outerWidth(!0) : this.element.outerWidth(!1),
          f = c.left,
          p = c.top;
        this.picker.removeClass("datepicker-orient-top datepicker-orient-bottom datepicker-orient-right datepicker-orient-left"), "auto" !== this.o.orientation.x ? (this.picker.addClass("datepicker-orient-" + this.o.orientation.x), "right" === this.o.orientation.x && (f -= e - u)) : (this.picker.addClass("datepicker-orient-left"), c.left < 0 ? f -= c.left - n : c.left + e > a && (f = a - e - n));
        var g, v, m = this.o.orientation.y;
        "auto" === m && (g = -r + c.top - i, v = r + s - (c.top + d + i), m = Math.max(g, v) === v ? "top" : "bottom"), this.picker.addClass("datepicker-orient-" + m), "top" === m ? p += d : p -= i + parseInt(this.picker.css("padding-top")), this.picker.css({
          top: p,
          left: f,
          zIndex: h
        })
      }
    },
    _allow_update: !0,
    update: function() {
      if (this._allow_update) {
        var e = this.dates.copy(),
          i = [],
          n = !1;
        arguments.length ? (t.each(arguments, t.proxy(function(t, e) {
          e instanceof Date && (e = this._local_to_utc(e)), i.push(e)
        }, this)), n = !0) : (i = this.isInput ? this.element.val() : this.element.data("date") || this.element.find("input").val(), i = i && this.o.multidate ? i.split(this.o.multidateSeparator) : [i], delete this.element.data().date), i = t.map(i, t.proxy(function(t) {
          return g.parseDate(t, this.o.format, this.o.language)
        }, this)), i = t.grep(i, t.proxy(function(t) {
          return t < this.o.startDate || t > this.o.endDate || !t
        }, this), !0), this.dates.replace(i), this.dates.length ? this.viewDate = new Date(this.dates.get(-1)) : this.viewDate < this.o.startDate ? this.viewDate = new Date(this.o.startDate) : this.viewDate > this.o.endDate && (this.viewDate = new Date(this.o.endDate)), n ? this.setValue() : i.length && String(e) !== String(this.dates) && this._trigger("changeDate"), !this.dates.length && e.length && this._trigger("clearDate"), this.fill()
      }
    },
    fillDow: function() {
      var t = this.o.weekStart,
        e = "<tr>";
      if (this.o.calendarWeeks) {
        var i = '<th class="cw">&nbsp;</th>';
        e += i, this.picker.find(".datepicker-days thead tr:first-child").prepend(i)
      }
      for (; t < this.o.weekStart + 7;) e += '<th class="dow">' + p[this.o.language].daysMin[t++ % 7] + "</th>";
      e += "</tr>", this.picker.find(".datepicker-days thead").append(e)
    },
    fillMonths: function() {
      for (var t = "", e = 0; 12 > e;) t += '<span class="month">' + p[this.o.language].monthsShort[e++] + "</span>";
      this.picker.find(".datepicker-months td").html(t)
    },
    setRange: function(e) {
      e && e.length ? this.range = t.map(e, function(t) {
        return t.valueOf()
      }) : delete this.range, this.fill()
    },
    getClassNames: function(e) {
      var i = [],
        n = this.viewDate.getUTCFullYear(),
        a = this.viewDate.getUTCMonth(),
        s = new Date;
      return e.getUTCFullYear() < n || e.getUTCFullYear() === n && e.getUTCMonth() < a ? i.push("old") : (e.getUTCFullYear() > n || e.getUTCFullYear() === n && e.getUTCMonth() > a) && i.push("new"), this.focusDate && e.valueOf() === this.focusDate.valueOf() && i.push("focused"), this.o.todayHighlight && e.getUTCFullYear() === s.getFullYear() && e.getUTCMonth() === s.getMonth() && e.getUTCDate() === s.getDate() && i.push("today"), -1 !== this.dates.contains(e) && i.push("active"), (e.valueOf() < this.o.startDate || e.valueOf() > this.o.endDate || -1 !== t.inArray(e.getUTCDay(), this.o.daysOfWeekDisabled)) && i.push("disabled"), this.range && (e > this.range[0] && e < this.range[this.range.length - 1] && i.push("range"), -1 !== t.inArray(e.valueOf(), this.range) && i.push("selected")), i
    },
    fill: function() {
      var n, a = new Date(this.viewDate),
        s = a.getUTCFullYear(),
        r = a.getUTCMonth(),
        o = this.o.startDate !== -1 / 0 ? this.o.startDate.getUTCFullYear() : -1 / 0,
        l = this.o.startDate !== -1 / 0 ? this.o.startDate.getUTCMonth() : -1 / 0,
        h = 1 / 0 !== this.o.endDate ? this.o.endDate.getUTCFullYear() : 1 / 0,
        c = 1 / 0 !== this.o.endDate ? this.o.endDate.getUTCMonth() : 1 / 0,
        d = p[this.o.language].today || p.en.today || "",
        u = p[this.o.language].clear || p.en.clear || "";
      if (!isNaN(s) && !isNaN(r)) {
        this.picker.find(".datepicker-days thead th.datepicker-switch").text(p[this.o.language].months[r] + " " + s), this.picker.find("tfoot th.today").text(d).toggle(this.o.todayBtn !== !1), this.picker.find("tfoot th.clear").text(u).toggle(this.o.clearBtn !== !1), this.updateNavArrows(), this.fillMonths();
        var f = i(s, r - 1, 28),
          v = g.getDaysInMonth(f.getUTCFullYear(), f.getUTCMonth());
        f.setUTCDate(v), f.setUTCDate(v - (f.getUTCDay() - this.o.weekStart + 7) % 7);
        var m = new Date(f);
        m.setUTCDate(m.getUTCDate() + 42), m = m.valueOf();
        for (var y, w = []; f.valueOf() < m;) {
          if (f.getUTCDay() === this.o.weekStart && (w.push("<tr>"), this.o.calendarWeeks)) {
            var D = new Date(+f + (this.o.weekStart - f.getUTCDay() - 7) % 7 * 864e5),
              b = new Date(Number(D) + (11 - D.getUTCDay()) % 7 * 864e5),
              k = new Date(Number(k = i(b.getUTCFullYear(), 0, 1)) + (11 - k.getUTCDay()) % 7 * 864e5),
              C = (b - k) / 864e5 / 7 + 1;
            w.push('<td class="cw">' + C + "</td>")
          }
          if (y = this.getClassNames(f), y.push("day"), this.o.beforeShowDay !== t.noop) {
            var T = this.o.beforeShowDay(this._utc_to_local(f));
            T === e ? T = {} : "boolean" == typeof T ? T = {
              enabled: T
            } : "string" == typeof T && (T = {
              classes: T
            }), T.enabled === !1 && y.push("disabled"), T.classes && (y = y.concat(T.classes.split(/\s+/))), T.tooltip && (n = T.tooltip)
          }
          y = t.unique(y), w.push('<td class="' + y.join(" ") + '"' + (n ? ' title="' + n + '"' : "") + ">" + f.getUTCDate() + "</td>"), n = null, f.getUTCDay() === this.o.weekEnd && w.push("</tr>"), f.setUTCDate(f.getUTCDate() + 1)
        }
        this.picker.find(".datepicker-days tbody").empty().append(w.join(""));
        var _ = this.picker.find(".datepicker-months").find("th:eq(1)").text(s).end().find("span").removeClass("active");
        t.each(this.dates, function(t, e) {
          e.getUTCFullYear() === s && _.eq(e.getUTCMonth()).addClass("active")
        }), (o > s || s > h) && _.addClass("disabled"), s === o && _.slice(0, l).addClass("disabled"), s === h && _.slice(c + 1).addClass("disabled"), w = "", s = 10 * parseInt(s / 10, 10);
        var x = this.picker.find(".datepicker-years").find("th:eq(1)").text(s + "-" + (s + 9)).end().find("td");
        s -= 1;
        for (var M, U = t.map(this.dates, function(t) {
            return t.getUTCFullYear()
          }), S = -1; 11 > S; S++) M = ["year"], -1 === S ? M.push("old") : 10 === S && M.push("new"), -1 !== t.inArray(s, U) && M.push("active"), (o > s || s > h) && M.push("disabled"), w += '<span class="' + M.join(" ") + '">' + s + "</span>", s += 1;
        x.html(w)
      }
    },
    updateNavArrows: function() {
      if (this._allow_update) {
        var t = new Date(this.viewDate),
          e = t.getUTCFullYear(),
          i = t.getUTCMonth();
        switch (this.viewMode) {
          case 0:
            this.picker.find(".prev").css(this.o.startDate !== -1 / 0 && e <= this.o.startDate.getUTCFullYear() && i <= this.o.startDate.getUTCMonth() ? {
              visibility: "hidden"
            } : {
              visibility: "visible"
            }), this.picker.find(".next").css(1 / 0 !== this.o.endDate && e >= this.o.endDate.getUTCFullYear() && i >= this.o.endDate.getUTCMonth() ? {
              visibility: "hidden"
            } : {
              visibility: "visible"
            });
            break;
          case 1:
          case 2:
            this.picker.find(".prev").css(this.o.startDate !== -1 / 0 && e <= this.o.startDate.getUTCFullYear() ? {
              visibility: "hidden"
            } : {
              visibility: "visible"
            }), this.picker.find(".next").css(1 / 0 !== this.o.endDate && e >= this.o.endDate.getUTCFullYear() ? {
              visibility: "hidden"
            } : {
              visibility: "visible"
            })
        }
      }
    },
    click: function(e) {
      e.preventDefault();
      var n, a, s, r = t(e.target).closest("span, td, th");
      if (1 === r.length) switch (r[0].nodeName.toLowerCase()) {
        case "th":
          switch (r[0].className) {
            case "datepicker-switch":
              this.showMode(1);
              break;
            case "prev":
            case "next":
              var o = g.modes[this.viewMode].navStep * ("prev" === r[0].className ? -1 : 1);
              switch (this.viewMode) {
                case 0:
                  this.viewDate = this.moveMonth(this.viewDate, o), this._trigger("changeMonth", this.viewDate);
                  break;
                case 1:
                case 2:
                  this.viewDate = this.moveYear(this.viewDate, o), 1 === this.viewMode && this._trigger("changeYear", this.viewDate)
              }
              this.fill();
              break;
            case "today":
              var l = new Date;
              l = i(l.getFullYear(), l.getMonth(), l.getDate(), 0, 0, 0), this.showMode(-2);
              var h = "linked" === this.o.todayBtn ? null : "view";
              this._setDate(l, h);
              break;
            case "clear":
              var c;
              this.isInput ? c = this.element : this.component && (c = this.element.find("input")), c && c.val("").change(), this.update(), this._trigger("changeDate"), this.o.autoclose && this.hide()
          }
          break;
        case "span":
          r.is(".disabled") || (this.viewDate.setUTCDate(1), r.is(".month") ? (s = 1, a = r.parent().find("span").index(r), n = this.viewDate.getUTCFullYear(), this.viewDate.setUTCMonth(a), this._trigger("changeMonth", this.viewDate), 1 === this.o.minViewMode && this._setDate(i(n, a, s))) : (s = 1, a = 0, n = parseInt(r.text(), 10) || 0, this.viewDate.setUTCFullYear(n), this._trigger("changeYear", this.viewDate), 2 === this.o.minViewMode && this._setDate(i(n, a, s))), this.showMode(-1), this.fill());
          break;
        case "td":
          r.is(".day") && !r.is(".disabled") && (s = parseInt(r.text(), 10) || 1, n = this.viewDate.getUTCFullYear(), a = this.viewDate.getUTCMonth(), r.is(".old") ? 0 === a ? (a = 11, n -= 1) : a -= 1 : r.is(".new") && (11 === a ? (a = 0, n += 1) : a += 1), this._setDate(i(n, a, s)))
      }
      this.picker.is(":visible") && this._focused_from && t(this._focused_from).focus(), delete this._focused_from
    },
    _toggle_multidate: function(t) {
      var e = this.dates.contains(t);
      if (t || this.dates.clear(), 1 === this.o.multidate && 0 === e || (-1 !== e ? this.dates.remove(e) : this.dates.push(t)), "number" == typeof this.o.multidate)
        for (; this.dates.length > this.o.multidate;) this.dates.remove(0)
    },
    _setDate: function(t, e) {
      e && "date" !== e || this._toggle_multidate(t && new Date(t)), e && "view" !== e || (this.viewDate = t && new Date(t)), this.fill(), this.setValue(), this._trigger("changeDate");
      var i;
      this.isInput ? i = this.element : this.component && (i = this.element.find("input")), i && i.change(), !this.o.autoclose || e && "date" !== e || this.hide()
    },
    moveMonth: function(t, i) {
      if (!t) return e;
      if (!i) return t;
      var n, a, s = new Date(t.valueOf()),
        r = s.getUTCDate(),
        o = s.getUTCMonth(),
        l = Math.abs(i);
      if (i = i > 0 ? 1 : -1, 1 === l) a = -1 === i ? function() {
        return s.getUTCMonth() === o
      } : function() {
        return s.getUTCMonth() !== n
      }, n = o + i, s.setUTCMonth(n), (0 > n || n > 11) && (n = (n + 12) % 12);
      else {
        for (var h = 0; l > h; h++) s = this.moveMonth(s, i);
        n = s.getUTCMonth(), s.setUTCDate(r), a = function() {
          return n !== s.getUTCMonth()
        }
      }
      for (; a();) s.setUTCDate(--r), s.setUTCMonth(n);
      return s
    },
    moveYear: function(t, e) {
      return this.moveMonth(t, 12 * e)
    },
    dateWithinRange: function(t) {
      return t >= this.o.startDate && t <= this.o.endDate
    },
    keydown: function(t) {
      if (this.picker.is(":not(:visible)")) return void(27 === t.keyCode && this.show());
      var e, i, a, s = !1,
        r = this.focusDate || this.viewDate;
      switch (t.keyCode) {
        case 27:
          this.focusDate ? (this.focusDate = null, this.viewDate = this.dates.get(-1) || this.viewDate, this.fill()) : this.hide(), t.preventDefault();
          break;
        case 37:
        case 39:
          if (!this.o.keyboardNavigation) break;
          e = 37 === t.keyCode ? -1 : 1, t.ctrlKey ? (i = this.moveYear(this.dates.get(-1) || n(), e), a = this.moveYear(r, e), this._trigger("changeYear", this.viewDate)) : t.shiftKey ? (i = this.moveMonth(this.dates.get(-1) || n(), e), a = this.moveMonth(r, e), this._trigger("changeMonth", this.viewDate)) : (i = new Date(this.dates.get(-1) || n()), i.setUTCDate(i.getUTCDate() + e), a = new Date(r), a.setUTCDate(r.getUTCDate() + e)), this.dateWithinRange(i) && (this.focusDate = this.viewDate = a, this.setValue(), this.fill(), t.preventDefault());
          break;
        case 38:
        case 40:
          if (!this.o.keyboardNavigation) break;
          e = 38 === t.keyCode ? -1 : 1, t.ctrlKey ? (i = this.moveYear(this.dates.get(-1) || n(), e), a = this.moveYear(r, e), this._trigger("changeYear", this.viewDate)) : t.shiftKey ? (i = this.moveMonth(this.dates.get(-1) || n(), e), a = this.moveMonth(r, e), this._trigger("changeMonth", this.viewDate)) : (i = new Date(this.dates.get(-1) || n()), i.setUTCDate(i.getUTCDate() + 7 * e), a = new Date(r), a.setUTCDate(r.getUTCDate() + 7 * e)), this.dateWithinRange(i) && (this.focusDate = this.viewDate = a, this.setValue(), this.fill(), t.preventDefault());
          break;
        case 32:
          break;
        case 13:
          r = this.focusDate || this.dates.get(-1) || this.viewDate, this.o.keyboardNavigation && (this._toggle_multidate(r), s = !0), this.focusDate = null, this.viewDate = this.dates.get(-1) || this.viewDate, this.setValue(), this.fill(), this.picker.is(":visible") && (t.preventDefault(), this.o.autoclose && this.hide());
          break;
        case 9:
          this.focusDate = null, this.viewDate = this.dates.get(-1) || this.viewDate, this.fill(), this.hide()
      }
      if (s) {
        this._trigger(this.dates.length ? "changeDate" : "clearDate");
        var o;
        this.isInput ? o = this.element : this.component && (o = this.element.find("input")), o && o.change()
      }
    },
    showMode: function(t) {
      t && (this.viewMode = Math.max(this.o.minViewMode, Math.min(2, this.viewMode + t))), this.picker.find(">div").hide().filter(".datepicker-" + g.modes[this.viewMode].clsName).css("display", "block"), this.updateNavArrows()
    }
  };
  var c = function(e, i) {
    this.element = t(e), this.inputs = t.map(i.inputs, function(t) {
      return t.jquery ? t[0] : t
    }), delete i.inputs, t(this.inputs).datepicker(i).bind("changeDate", t.proxy(this.dateUpdated, this)), this.pickers = t.map(this.inputs, function(e) {
      return t(e).data("datepicker")
    }), this.updateDates()
  };
  c.prototype = {
    updateDates: function() {
      this.dates = t.map(this.pickers, function(t) {
        return t.getUTCDate()
      }), this.updateRanges()
    },
    updateRanges: function() {
      var e = t.map(this.dates, function(t) {
        return t.valueOf()
      });
      t.each(this.pickers, function(t, i) {
        i.setRange(e)
      })
    },
    dateUpdated: function(e) {
      if (!this.updating) {
        this.updating = !0;
        var i = t(e.target).data("datepicker"),
          n = i.getUTCDate(),
          a = t.inArray(e.target, this.inputs),
          s = this.inputs.length;
        if (-1 !== a) {
          if (t.each(this.pickers, function(t, e) {
              e.getUTCDate() || e.setUTCDate(n)
            }), n < this.dates[a])
            for (; a >= 0 && n < this.dates[a];) this.pickers[a--].setUTCDate(n);
          else if (n > this.dates[a])
            for (; s > a && n > this.dates[a];) this.pickers[a++].setUTCDate(n);
          this.updateDates(), delete this.updating
        }
      }
    },
    remove: function() {
      t.map(this.pickers, function(t) {
        t.remove()
      }), delete this.element.data().datepicker
    }
  };
  var d = t.fn.datepicker;
  t.fn.datepicker = function(i) {
    var n = Array.apply(null, arguments);
    n.shift();
    var a;
    return this.each(function() {
      var o = t(this),
        l = o.data("datepicker"),
        d = "object" == typeof i && i;
      if (!l) {
        var f = s(this, "date"),
          p = t.extend({}, u, f, d),
          g = r(p.language),
          v = t.extend({}, u, g, f, d);
        if (o.is(".input-daterange") || v.inputs) {
          var m = {
            inputs: v.inputs || o.find("input").toArray()
          };
          o.data("datepicker", l = new c(this, t.extend(v, m)))
        } else o.data("datepicker", l = new h(this, v))
      }
      return "string" == typeof i && "function" == typeof l[i] && (a = l[i].apply(l, n), a !== e) ? !1 : void 0
    }), a !== e ? a : this
  };
  var u = t.fn.datepicker.defaults = {
      autoclose: !1,
      beforeShowDay: t.noop,
      calendarWeeks: !1,
      clearBtn: !1,
      daysOfWeekDisabled: [],
      endDate: 1 / 0,
      forceParse: !0,
      format: "mm/dd/yyyy",
      keyboardNavigation: !0,
      language: "en",
      minViewMode: 0,
      multidate: !1,
      multidateSeparator: ",",
      orientation: "auto",
      rtl: !1,
      startDate: -1 / 0,
      startView: 0,
      todayBtn: !1,
      todayHighlight: !1,
      weekStart: 0
    },
    f = t.fn.datepicker.locale_opts = ["format", "rtl", "weekStart"];
  t.fn.datepicker.Constructor = h;
  var p = t.fn.datepicker.dates = {
      en: {
        days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        today: "Today",
        clear: "Clear"
      }
    },
    g = {
      modes: [{
        clsName: "days",
        navFnc: "Month",
        navStep: 1
      }, {
        clsName: "months",
        navFnc: "FullYear",
        navStep: 1
      }, {
        clsName: "years",
        navFnc: "FullYear",
        navStep: 10
      }],
      isLeapYear: function(t) {
        return t % 4 === 0 && t % 100 !== 0 || t % 400 === 0
      },
      getDaysInMonth: function(t, e) {
        return [31, g.isLeapYear(t) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][e]
      },
      validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
      nonpunctuation: /[^ -\/:-@\[\u3400-\u9fff-`{-~\t\n\r]+/g,
      parseFormat: function(t) {
        var e = t.replace(this.validParts, "\x00").split("\x00"),
          i = t.match(this.validParts);
        if (!e || !e.length || !i || 0 === i.length) throw new Error("Invalid date format.");
        return {
          separators: e,
          parts: i
        }
      },
      parseDate: function(n, a, s) {
        function r() {
          var t = this.slice(0, u[c].length),
            e = u[c].slice(0, t.length);
          return t === e
        }
        if (!n) return e;
        if (n instanceof Date) return n;
        "string" == typeof a && (a = g.parseFormat(a));
        var o, l, c, d = /([\-+]\d+)([dmwy])/,
          u = n.match(/([\-+]\d+)([dmwy])/g);
        if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(n)) {
          for (n = new Date, c = 0; c < u.length; c++) switch (o = d.exec(u[c]), l = parseInt(o[1]), o[2]) {
            case "d":
              n.setUTCDate(n.getUTCDate() + l);
              break;
            case "m":
              n = h.prototype.moveMonth.call(h.prototype, n, l);
              break;
            case "w":
              n.setUTCDate(n.getUTCDate() + 7 * l);
              break;
            case "y":
              n = h.prototype.moveYear.call(h.prototype, n, l)
          }
          return i(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate(), 0, 0, 0)
        }
        u = n && n.match(this.nonpunctuation) || [], n = new Date;
        var f, v, m = {},
          y = ["yyyy", "yy", "M", "MM", "m", "mm", "d", "dd"],
          w = {
            yyyy: function(t, e) {
              return t.setUTCFullYear(e)
            },
            yy: function(t, e) {
              return t.setUTCFullYear(2e3 + e)
            },
            m: function(t, e) {
              if (isNaN(t)) return t;
              for (e -= 1; 0 > e;) e += 12;
              for (e %= 12, t.setUTCMonth(e); t.getUTCMonth() !== e;) t.setUTCDate(t.getUTCDate() - 1);
              return t
            },
            d: function(t, e) {
              return t.setUTCDate(e)
            }
          };
        w.M = w.MM = w.mm = w.m, w.dd = w.d, n = i(n.getFullYear(), n.getMonth(), n.getDate(), 0, 0, 0);
        var D = a.parts.slice();
        if (u.length !== D.length && (D = t(D).filter(function(e, i) {
            return -1 !== t.inArray(i, y)
          }).toArray()), u.length === D.length) {
          var b;
          for (c = 0, b = D.length; b > c; c++) {
            if (f = parseInt(u[c], 10), o = D[c], isNaN(f)) switch (o) {
              case "MM":
                v = t(p[s].months).filter(r), f = t.inArray(v[0], p[s].months) + 1;
                break;
              case "M":
                v = t(p[s].monthsShort).filter(r), f = t.inArray(v[0], p[s].monthsShort) + 1
            }
            m[o] = f
          }
          var k, C;
          for (c = 0; c < y.length; c++) C = y[c], C in m && !isNaN(m[C]) && (k = new Date(n), w[C](k, m[C]), isNaN(k) || (n = k))
        }
        return n
      },
      formatDate: function(e, i, n) {
        if (!e) return "";
        "string" == typeof i && (i = g.parseFormat(i));
        var a = {
          d: e.getUTCDate(),
          D: p[n].daysShort[e.getUTCDay()],
          DD: p[n].days[e.getUTCDay()],
          m: e.getUTCMonth() + 1,
          M: p[n].monthsShort[e.getUTCMonth()],
          MM: p[n].months[e.getUTCMonth()],
          yy: e.getUTCFullYear().toString().substring(2),
          yyyy: e.getUTCFullYear()
        };
        a.dd = (a.d < 10 ? "0" : "") + a.d, a.mm = (a.m < 10 ? "0" : "") + a.m, e = [];
        for (var s = t.extend([], i.separators), r = 0, o = i.parts.length; o >= r; r++) s.length && e.push(s.shift()), e.push(a[i.parts[r]]);
        return e.join("")
      },
      headTemplate: '<thead><tr><th class="prev">&laquo;</th><th colspan="5" class="datepicker-switch"></th><th class="next">&raquo;</th></tr></thead>',
      contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
      footTemplate: '<tfoot><tr><th colspan="7" class="today"></th></tr><tr><th colspan="7" class="clear"></th></tr></tfoot>'
    };
  g.template = '<div class="datepicker"><div class="datepicker-days"><table class=" table-condensed">' + g.headTemplate + "<tbody></tbody>" + g.footTemplate + '</table></div><div class="datepicker-months"><table class="table-condensed">' + g.headTemplate + g.contTemplate + g.footTemplate + '</table></div><div class="datepicker-years"><table class="table-condensed">' + g.headTemplate + g.contTemplate + g.footTemplate + "</table></div></div>", t.fn.datepicker.DPGlobal = g, t.fn.datepicker.noConflict = function() {
    return t.fn.datepicker = d, this
  }, t(document).on("focus.datepicker.data-api click.datepicker.data-api", '[data-provide="datepicker"]', function(e) {
    var i = t(this);
    i.data("datepicker") || (e.preventDefault(), i.datepicker("show"))
  }), t(function() {
    t('[data-provide="datepicker-inline"]').datepicker()
  })
}(window.jQuery),
function() {
  function t() {}

  function e(t, e) {
    for (var i = t.length; i--;)
      if (t[i].listener === e) return i;
    return -1
  }

  function i(t) {
    return function() {
      return this[t].apply(this, arguments)
    }
  }
  var n = t.prototype,
    a = this,
    s = a.EventEmitter;
  n.getListeners = function(t) {
    var e, i, n = this._getEvents();
    if ("object" == typeof t) {
      e = {};
      for (i in n) n.hasOwnProperty(i) && t.test(i) && (e[i] = n[i])
    } else e = n[t] || (n[t] = []);
    return e
  }, n.flattenListeners = function(t) {
    var e, i = [];
    for (e = 0; e < t.length; e += 1) i.push(t[e].listener);
    return i
  }, n.getListenersAsObject = function(t) {
    var e, i = this.getListeners(t);
    return i instanceof Array && (e = {}, e[t] = i), e || i
  }, n.addListener = function(t, i) {
    var n, a = this.getListenersAsObject(t),
      s = "object" == typeof i;
    for (n in a) a.hasOwnProperty(n) && -1 === e(a[n], i) && a[n].push(s ? i : {
      listener: i,
      once: !1
    });
    return this
  }, n.on = i("addListener"), n.addOnceListener = function(t, e) {
    return this.addListener(t, {
      listener: e,
      once: !0
    })
  }, n.once = i("addOnceListener"), n.defineEvent = function(t) {
    return this.getListeners(t), this
  }, n.defineEvents = function(t) {
    for (var e = 0; e < t.length; e += 1) this.defineEvent(t[e]);
    return this
  }, n.removeListener = function(t, i) {
    var n, a, s = this.getListenersAsObject(t);
    for (a in s) s.hasOwnProperty(a) && (n = e(s[a], i), -1 !== n && s[a].splice(n, 1));
    return this
  }, n.off = i("removeListener"), n.addListeners = function(t, e) {
    return this.manipulateListeners(!1, t, e)
  }, n.removeListeners = function(t, e) {
    return this.manipulateListeners(!0, t, e)
  }, n.manipulateListeners = function(t, e, i) {
    var n, a, s = t ? this.removeListener : this.addListener,
      r = t ? this.removeListeners : this.addListeners;
    if ("object" != typeof e || e instanceof RegExp)
      for (n = i.length; n--;) s.call(this, e, i[n]);
    else
      for (n in e) e.hasOwnProperty(n) && (a = e[n]) && ("function" == typeof a ? s.call(this, n, a) : r.call(this, n, a));
    return this
  }, n.removeEvent = function(t) {
    var e, i = typeof t,
      n = this._getEvents();
    if ("string" === i) delete n[t];
    else if ("object" === i)
      for (e in n) n.hasOwnProperty(e) && t.test(e) && delete n[e];
    else delete this._events;
    return this
  }, n.removeAllListeners = i("removeEvent"), n.emitEvent = function(t, e) {
    var i, n, a, s, r = this.getListenersAsObject(t);
    for (a in r)
      if (r.hasOwnProperty(a))
        for (n = r[a].length; n--;) i = r[a][n], i.once === !0 && this.removeListener(t, i.listener), s = i.listener.apply(this, e || []), s === this._getOnceReturnValue() && this.removeListener(t, i.listener);
    return this
  }, n.trigger = i("emitEvent"), n.emit = function(t) {
    var e = Array.prototype.slice.call(arguments, 1);
    return this.emitEvent(t, e)
  }, n.setOnceReturnValue = function(t) {
    return this._onceReturnValue = t, this
  }, n._getOnceReturnValue = function() {
    return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0
  }, n._getEvents = function() {
    return this._events || (this._events = {})
  }, t.noConflict = function() {
    return a.EventEmitter = s, t
  }, "function" == typeof define && define.amd ? define("eventEmitter/EventEmitter", [], function() {
    return t
  }) : "object" == typeof module && module.exports ? module.exports = t : this.EventEmitter = t
}.call(this),
  function(t) {
    function e(e) {
      var i = t.event;
      return i.target = i.target || i.srcElement || e, i
    }
    var i = document.documentElement,
      n = function() {};
    i.addEventListener ? n = function(t, e, i) {
      t.addEventListener(e, i, !1)
    } : i.attachEvent && (n = function(t, i, n) {
      t[i + n] = n.handleEvent ? function() {
        var i = e(t);
        n.handleEvent.call(n, i)
      } : function() {
        var i = e(t);
        n.call(t, i)
      }, t.attachEvent("on" + i, t[i + n])
    });
    var a = function() {};
    i.removeEventListener ? a = function(t, e, i) {
      t.removeEventListener(e, i, !1)
    } : i.detachEvent && (a = function(t, e, i) {
      t.detachEvent("on" + e, t[e + i]);
      try {
        delete t[e + i]
      } catch (n) {
        t[e + i] = void 0
      }
    });
    var s = {
      bind: n,
      unbind: a
    };
    "function" == typeof define && define.amd ? define("eventie/eventie", s) : t.eventie = s
  }(this),
  function(t, e) {
    "function" == typeof define && define.amd ? define(["eventEmitter/EventEmitter", "eventie/eventie"], function(i, n) {
      return e(t, i, n)
    }) : "object" == typeof exports ? module.exports = e(t, require("wolfy87-eventemitter"), require("eventie")) : t.imagesLoaded = e(t, t.EventEmitter, t.eventie)
  }(window, function(t, e, i) {
    function n(t, e) {
      for (var i in e) t[i] = e[i];
      return t
    }

    function a(t) {
      return "[object Array]" === u.call(t)
    }

    function s(t) {
      var e = [];
      if (a(t)) e = t;
      else if ("number" == typeof t.length)
        for (var i = 0, n = t.length; n > i; i++) e.push(t[i]);
      else e.push(t);
      return e
    }

    function r(t, e, i) {
      if (!(this instanceof r)) return new r(t, e);
      "string" == typeof t && (t = document.querySelectorAll(t)), this.elements = s(t), this.options = n({}, this.options), "function" == typeof e ? i = e : n(this.options, e), i && this.on("always", i), this.getImages(), h && (this.jqDeferred = new h.Deferred);
      var a = this;
      setTimeout(function() {
        a.check()
      })
    }

    function o(t) {
      this.img = t
    }

    function l(t) {
      this.src = t, f[t] = this
    }
    var h = t.jQuery,
      c = t.console,
      d = "undefined" != typeof c,
      u = Object.prototype.toString;
    r.prototype = new e, r.prototype.options = {}, r.prototype.getImages = function() {
      this.images = [];
      for (var t = 0, e = this.elements.length; e > t; t++) {
        var i = this.elements[t];
        "IMG" === i.nodeName && this.addImage(i);
        var n = i.nodeType;
        if (n && (1 === n || 9 === n || 11 === n))
          for (var a = i.querySelectorAll("img"), s = 0, r = a.length; r > s; s++) {
            var o = a[s];
            this.addImage(o)
          }
      }
    }, r.prototype.addImage = function(t) {
      var e = new o(t);
      this.images.push(e)
    }, r.prototype.check = function() {
      function t(t, a) {
        return e.options.debug && d && c.log("confirm", t, a), e.progress(t), i++, i === n && e.complete(), !0
      }
      var e = this,
        i = 0,
        n = this.images.length;
      if (this.hasAnyBroken = !1, !n) return void this.complete();
      for (var a = 0; n > a; a++) {
        var s = this.images[a];
        s.on("confirm", t), s.check()
      }
    }, r.prototype.progress = function(t) {
      this.hasAnyBroken = this.hasAnyBroken || !t.isLoaded;
      var e = this;
      setTimeout(function() {
        e.emit("progress", e, t), e.jqDeferred && e.jqDeferred.notify && e.jqDeferred.notify(e, t)
      })
    }, r.prototype.complete = function() {
      var t = this.hasAnyBroken ? "fail" : "done";
      this.isComplete = !0;
      var e = this;
      setTimeout(function() {
        if (e.emit(t, e), e.emit("always", e), e.jqDeferred) {
          var i = e.hasAnyBroken ? "reject" : "resolve";
          e.jqDeferred[i](e)
        }
      })
    }, h && (h.fn.imagesLoaded = function(t, e) {
      var i = new r(this, t, e);
      return i.jqDeferred.promise(h(this))
    }), o.prototype = new e, o.prototype.check = function() {
      var t = f[this.img.src] || new l(this.img.src);
      if (t.isConfirmed) return void this.confirm(t.isLoaded, "cached was confirmed");
      if (this.img.complete && void 0 !== this.img.naturalWidth) return void this.confirm(0 !== this.img.naturalWidth, "naturalWidth");
      var e = this;
      t.on("confirm", function(t, i) {
        return e.confirm(t.isLoaded, i), !0
      }), t.check()
    }, o.prototype.confirm = function(t, e) {
      this.isLoaded = t, this.emit("confirm", this, e)
    };
    var f = {};
    return l.prototype = new e, l.prototype.check = function() {
      if (!this.isChecked) {
        var t = new Image;
        i.bind(t, "load", this), i.bind(t, "error", this), t.src = this.src, this.isChecked = !0
      }
    }, l.prototype.handleEvent = function(t) {
      var e = "on" + t.type;
      this[e] && this[e](t)
    }, l.prototype.onload = function(t) {
      this.confirm(!0, "onload"), this.unbindProxyEvents(t)
    }, l.prototype.onerror = function(t) {
      this.confirm(!1, "onerror"), this.unbindProxyEvents(t)
    }, l.prototype.confirm = function(t, e) {
      this.isConfirmed = !0, this.isLoaded = t, this.emit("confirm", this, e)
    }, l.prototype.unbindProxyEvents = function(t) {
      i.unbind(t.target, "load", this), i.unbind(t.target, "error", this)
    }, r
  }), ! function(t, e, i) {
    "use strict";

    function n(e, g, v) {
      function $() {
        if (ye.initialized) {
          var i = 0,
            n = Pe.length;
          if (Te.old = t.extend({}, Te), ke = we ? 0 : De[me.horizontal ? "width" : "height"](), Me = _e[me.horizontal ? "width" : "height"](), Ce = we ? e : be[me.horizontal ? "outerWidth" : "outerHeight"](), Pe.length = 0, Te.start = 0, Te.end = O(Ce - ke, 0), qe) {
            i = Ae.length, Oe = be.children(me.itemSelector), Ae.length = 0;
            var a, s = h(be, me.horizontal ? "paddingLeft" : "paddingTop"),
              r = h(be, me.horizontal ? "paddingRight" : "paddingBottom"),
              o = "border-box" === t(Oe).css("boxSizing"),
              l = "none" !== Oe.css("float"),
              d = 0,
              u = Oe.length - 1;
            Ce = 0, Oe.each(function(e, i) {
              var n = t(i),
                o = n[me.horizontal ? "outerWidth" : "outerHeight"](),
                c = h(n, me.horizontal ? "marginLeft" : "marginTop"),
                f = h(n, me.horizontal ? "marginRight" : "marginBottom"),
                p = o + c + f,
                g = !c || !f,
                v = {};
              v.el = i, v.size = g ? o : p, v.half = v.size / 2, v.start = Ce + (g ? c : 0), v.center = v.start - P(ke / 2 - v.size / 2), v.end = v.start - ke + v.size, e || (Ce += s), Ce += p, me.horizontal || l || f && c && e > 0 && (Ce -= A(c, f)), e === u && (v.end += r, Ce += r, d = g ? f : 0), Ae.push(v), a = v
            }), be[0].style[me.horizontal ? "width" : "height"] = (o ? Ce : Ce - s - r) + "px", Ce -= d, Ae.length ? (Te.start = Ae[0][Be ? "center" : "start"], Te.end = Be ? a.center : Ce > ke ? a.end : Te.start) : Te.start = Te.end = 0
          }
          if (Te.center = P(Te.end / 2 + Te.start / 2), R(), xe.length && Me > 0 && (me.dynamicHandle ? (Ue = Te.start === Te.end ? Me : P(Me * ke / Ce), Ue = c(Ue, me.minHandleSize, Me), xe[0].style[me.horizontal ? "width" : "height"] = Ue + "px") : Ue = xe[me.horizontal ? "outerWidth" : "outerHeight"](), Se.end = Me - Ue, ai || L()), !we && ke > 0) {
            var f = Te.start,
              p = "";
            if (qe) t.each(Ae, function(t, e) {
              Be ? Pe.push(e.center) : e.start + e.size > f && f <= Te.end && (f = e.start, Pe.push(f), f += ke, f > Te.end && f < Te.end + ke && Pe.push(Te.end))
            });
            else
              for (; f - ke < Te.end;) Pe.push(f), f += ke;
            if (Ie[0] && n !== Pe.length) {
              for (var g = 0; g < Pe.length; g++) p += me.pageBuilder.call(ye, g);
              Ee = Ie.html(p).children(), Ee.eq(Ye.activePage).addClass(me.activeClass)
            }
          }
          if (Ye.slideeSize = Ce, Ye.frameSize = ke, Ye.sbSize = Me, Ye.handleSize = Ue, qe) {
            ye.initialized ? (Ye.activeItem >= Ae.length || 0 === i && Ae.length > 0) && V(Ye.activeItem >= Ae.length ? Ae.length - 1 : 0, !i) : (V(me.startAt), ye[je ? "toCenter" : "toStart"](me.startAt));
            var v = Ae[Ye.activeItem];
            F(je && v ? v.center : c(Te.dest, Te.start, Te.end))
          } else ye.initialized ? F(c(Te.dest, Te.start, Te.end)) : F(me.startAt, 1);
          pe("load")
        }
      }

      function F(t, e, i) {
        if (qe && ii.released && !i) {
          var n = H(t),
            a = t > Te.start && t < Te.end;
          je ? (a && (t = Ae[n.centerItem].center), Be && me.activateMiddle && V(n.centerItem)) : a && (t = Ae[n.firstItem].start)
        }
        ii.init && ii.slidee && me.elasticBounds ? t > Te.end ? t = Te.end + (t - Te.end) / 6 : t < Te.start && (t = Te.start + (t - Te.start) / 6) : t = c(t, Te.start, Te.end), ti.start = +new Date, ti.time = 0, ti.from = Te.cur, ti.to = t, ti.delta = t - Te.cur, ti.tweesing = ii.tweese || ii.init && !ii.slidee, ti.immediate = !ti.tweesing && (e || ii.init && ii.slidee || !me.speed), ii.tweese = 0, t !== Te.dest && (Te.dest = t, pe("change"), ai || z()), K(), R(), X(), N()
      }

      function z() {
        if (ye.initialized) {
          if (!ai) return ai = w(z), void(ii.released && pe("moveStart"));
          ti.immediate ? Te.cur = ti.to : ti.tweesing ? (ti.tweeseDelta = ti.to - Te.cur, S(ti.tweeseDelta) < .1 ? Te.cur = ti.to : Te.cur += ti.tweeseDelta * (ii.released ? me.swingSpeed : me.syncSpeed)) : (ti.time = A(+new Date - ti.start, me.speed), Te.cur = ti.from + ti.delta * jQuery.easing[me.easing](ti.time / me.speed, ti.time, 0, 1, me.speed)), ti.to === Te.cur ? (Te.cur = ti.to, ii.tweese = ai = 0) : ai = w(z), pe("move"), we || (u ? be[0].style[u] = f + (me.horizontal ? "translateX" : "translateY") + "(" + -Te.cur + "px)" : be[0].style[me.horizontal ? "left" : "top"] = -P(Te.cur) + "px"), !ai && ii.released && pe("moveEnd"), L()
        }
      }

      function L() {
        xe.length && (Se.cur = Te.start === Te.end ? 0 : ((ii.init && !ii.slidee ? Te.dest : Te.cur) - Te.start) / (Te.end - Te.start) * Se.end, Se.cur = c(P(Se.cur), Se.start, Se.end), Ze.hPos !== Se.cur && (Ze.hPos = Se.cur, u ? xe[0].style[u] = f + (me.horizontal ? "translateX" : "translateY") + "(" + Se.cur + "px)" : xe[0].style[me.horizontal ? "left" : "top"] = Se.cur + "px"))
      }

      function N() {
        Ee[0] && Ze.page !== Ye.activePage && (Ze.page = Ye.activePage, Ee.removeClass(me.activeClass).eq(Ye.activePage).addClass(me.activeClass), pe("activePage", Ze.page))
      }

      function B() {
        ei.speed && Te.cur !== (ei.speed > 0 ? Te.end : Te.start) || ye.stop(), oi = ii.init ? w(B) : 0, ei.now = +new Date, ei.pos = Te.cur + (ei.now - ei.lastTime) / 1e3 * ei.speed, F(ii.init ? ei.pos : P(ei.pos)), ii.init || Te.cur !== Te.dest || pe("moveEnd"), ei.lastTime = ei.now
      }

      function j(t, e, n) {
        if ("boolean" === a(e) && (n = e, e = i), e === i) F(Te[t], n);
        else {
          if (je && "center" !== t) return;
          var s = ye.getPos(e);
          s && F(s[t], n, !je)
        }
      }

      function q(t) {
        return null != t ? l(t) ? t >= 0 && t < Ae.length ? t : -1 : Oe.index(t) : -1
      }

      function W(t) {
        return q(l(t) && 0 > t ? t + Ae.length : t)
      }

      function V(t, e) {
        var i = q(t);
        return !qe || 0 > i ? !1 : ((Ze.active !== i || e) && (Oe.eq(Ye.activeItem).removeClass(me.activeClass), Oe.eq(i).addClass(me.activeClass), Ze.active = Ye.activeItem = i, X(), pe("active", i)), i)
      }

      function H(t) {
        t = c(l(t) ? t : Te.dest, Te.start, Te.end);
        var e = {},
          i = Be ? 0 : ke / 2;
        if (!we)
          for (var n = 0, a = Pe.length; a > n; n++) {
            if (t >= Te.end || n === Pe.length - 1) {
              e.activePage = Pe.length - 1;
              break
            }
            if (t <= Pe[n] + i) {
              e.activePage = n;
              break
            }
          }
        if (qe) {
          for (var s = !1, r = !1, o = !1, h = 0, d = Ae.length; d > h; h++)
            if (s === !1 && t <= Ae[h].start + Ae[h].half && (s = h), o === !1 && t <= Ae[h].center + Ae[h].half && (o = h), h === d - 1 || t <= Ae[h].end + Ae[h].half) {
              r = h;
              break
            }
          e.firstItem = l(s) ? s : 0, e.centerItem = l(o) ? o : e.firstItem, e.lastItem = l(r) ? r : e.centerItem
        }
        return e
      }

      function R(e) {
        t.extend(Ye, H(e))
      }

      function X() {
        var t = Te.dest <= Te.start,
          e = Te.dest >= Te.end,
          i = t ? 1 : e ? 2 : 3;
        if (Ze.slideePosState !== i && (Ze.slideePosState = i, Qe.is("button,input") && Qe.prop("disabled", t), Ke.is("button,input") && Ke.prop("disabled", e), Qe.add(Re)[t ? "addClass" : "removeClass"](me.disabledClass), Ke.add(He)[e ? "addClass" : "removeClass"](me.disabledClass)), Ze.fwdbwdState !== i && ii.released && (Ze.fwdbwdState = i, Re.is("button,input") && Re.prop("disabled", t), He.is("button,input") && He.prop("disabled", e)), qe) {
          var n = 0 === Ye.activeItem,
            a = Ye.activeItem >= Ae.length - 1,
            s = n ? 1 : a ? 2 : 3;
          Ze.itemsButtonState !== s && (Ze.itemsButtonState = s, Xe.is("button,input") && Xe.prop("disabled", n), Je.is("button,input") && Je.prop("disabled", a), Xe[n ? "addClass" : "removeClass"](me.disabledClass), Je[a ? "addClass" : "removeClass"](me.disabledClass))
        }
      }

      function J(t, e, i) {
        if (t = W(t), e = W(e), t > -1 && e > -1 && t !== e && (!i || e !== t - 1) && (i || e !== t + 1)) {
          Oe.eq(t)[i ? "insertAfter" : "insertBefore"](Ae[e].el);
          var n = e > t ? t : i ? e : e - 1,
            a = t > e ? t : i ? e + 1 : e,
            s = t > e;
          t === Ye.activeItem ? Ze.active = Ye.activeItem = i ? s ? e + 1 : e : s ? e : e - 1 : Ye.activeItem > n && Ye.activeItem < a && (Ze.active = Ye.activeItem += s ? 1 : -1), $()
        }
      }

      function Q(t, e) {
        for (var i = 0, n = Ge[t].length; n > i; i++)
          if (Ge[t][i] === e) return i;
        return -1
      }

      function K() {
        ii.released && !ye.isPaused && ye.resume()
      }

      function G(t) {
        return P(c(t, Se.start, Se.end) / Se.end * (Te.end - Te.start)) + Te.start
      }

      function Z() {
        ii.history[0] = ii.history[1], ii.history[1] = ii.history[2], ii.history[2] = ii.history[3], ii.history[3] = ii.delta
      }

      function te(t) {
        ii.released = 0, ii.source = t, ii.slidee = "slidee" === t
      }

      function ee(e) {
        var i = "touchstart" === e.type,
          n = e.data.source,
          a = "slidee" === n;
        ii.init || !i && ae(e.target) || ("handle" !== n || me.dragHandle && Se.start !== Se.end) && (!a || (i ? me.touchDragging : me.mouseDragging && e.which < 2)) && (i || s(e), te(n), ii.init = 0, ii.$source = t(e.target), ii.touch = i, ii.pointer = i ? e.originalEvent.touches[0] : e, ii.initX = ii.pointer.pageX, ii.initY = ii.pointer.pageY, ii.initPos = a ? Te.cur : Se.cur, ii.start = +new Date, ii.time = 0, ii.path = 0, ii.delta = 0, ii.locked = 0, ii.history = [0, 0, 0, 0], ii.pathToLock = a ? i ? 30 : 10 : 0, D.on(i ? C : k, ie), ye.pause(1), (a ? be : xe).addClass(me.draggedClass), pe("moveStart"), a && (si = setInterval(Z, 10)))
      }

      function ie(t) {
        if (ii.released = "mouseup" === t.type || "touchend" === t.type, ii.pointer = ii.touch ? t.originalEvent[ii.released ? "changedTouches" : "touches"][0] : t, ii.pathX = ii.pointer.pageX - ii.initX, ii.pathY = ii.pointer.pageY - ii.initY, ii.path = I(E(ii.pathX, 2) + E(ii.pathY, 2)), ii.delta = me.horizontal ? ii.pathX : ii.pathY, !ii.init) {
          if (!(me.horizontal ? S(ii.pathX) > S(ii.pathY) : S(ii.pathX) < S(ii.pathY))) return ne();
          ii.init = 1
        }
        s(t), !ii.locked && ii.path > ii.pathToLock && ii.slidee && (ii.locked = 1, ii.$source.on(_, r)), ii.released && (ne(), me.releaseSwing && ii.slidee && (ii.swing = (ii.delta - ii.history[0]) / 40 * 300, ii.delta += ii.swing, ii.tweese = S(ii.swing) > 10)), F(ii.slidee ? P(ii.initPos - ii.delta) : G(ii.initPos + ii.delta))
      }

      function ne() {
        clearInterval(si), D.off(ii.touch ? C : k, ie), (ii.slidee ? be : xe).removeClass(me.draggedClass), setTimeout(function() {
          ii.$source.off(_, r)
        }), ye.resume(1), Te.cur === Te.dest && ii.init && pe("moveEnd"), ii.init = 0
      }

      function ae(e) {
        return ~t.inArray(e.nodeName, M) || t(e).is(me.interactive)
      }

      function se() {
        ye.stop(), D.off("mouseup", se)
      }

      function re(t) {
        switch (s(t), this) {
          case He[0]:
          case Re[0]:
            ye.moveBy(He.is(this) ? me.moveBy : -me.moveBy), D.on("mouseup", se);
            break;
          case Xe[0]:
            ye.prev();
            break;
          case Je[0]:
            ye.next();
            break;
          case Qe[0]:
            ye.prevPage();
            break;
          case Ke[0]:
            ye.nextPage()
        }
      }

      function oe(t) {
        return ni.curDelta = (me.horizontal ? t.deltaY || t.deltaX : t.deltaY) || -t.wheelDelta, ni.curDelta /= 1 === t.deltaMode ? 3 : 100, qe ? (p = +new Date, ni.last < p - ni.resetTime && (ni.delta = 0), ni.last = p, ni.delta += ni.curDelta, S(ni.delta) < 1 ? ni.finalDelta = 0 : (ni.finalDelta = P(ni.delta / 1), ni.delta %= 1), ni.finalDelta) : ni.curDelta
      }

      function le(t) {
        var e = +new Date;
        if (Y + 300 > e) return void(Y = e);
        if (me.scrollBy && Te.start !== Te.end) {
          var i = oe(t.originalEvent);
          (me.scrollTrap || i > 0 && Te.dest < Te.end || 0 > i && Te.dest > Te.start) && s(t, 1), ye.slideBy(me.scrollBy * i)
        }
      }

      function he(t) {
        me.clickBar && t.target === _e[0] && (s(t), F(G((me.horizontal ? t.pageX - _e.offset().left : t.pageY - _e.offset().top) - Ue / 2)))
      }

      function ce(t) {
        if (me.keyboardNavBy) switch (t.which) {
          case me.horizontal ? 37:
            38: s(t), ye["pages" === me.keyboardNavBy ? "prevPage" : "prev"]();
            break;
          case me.horizontal ? 39:
            40: s(t), ye["pages" === me.keyboardNavBy ? "nextPage" : "next"]()
        }
      }

      function de(t) {
        return ae(this) ? void t.stopPropagation() : void(this.parentNode === be[0] && ye.activate(this))
      }

      function ue() {
        this.parentNode === Ie[0] && ye.activatePage(Ee.index(this))
      }

      function fe(t) {
        me.pauseOnHover && ye["mouseenter" === t.type ? "pause" : "resume"](2)
      }

      function pe(t, e) {
        if (Ge[t]) {
          for (ve = Ge[t].length, U.length = 0, ge = 0; ve > ge; ge++) U.push(Ge[t][ge]);
          for (ge = 0; ve > ge; ge++) U[ge].call(ye, t, e)
        }
      }
      var ge, ve, me = t.extend({}, n.defaults, g),
        ye = this,
        we = l(e),
        De = t(e),
        be = De.children().eq(0),
        ke = 0,
        Ce = 0,
        Te = {
          start: 0,
          center: 0,
          end: 0,
          cur: 0,
          dest: 0
        },
        _e = t(me.scrollBar).eq(0),
        xe = _e.children().eq(0),
        Me = 0,
        Ue = 0,
        Se = {
          start: 0,
          end: 0,
          cur: 0
        },
        Ie = t(me.pagesBar),
        Ee = 0,
        Pe = [],
        Oe = 0,
        Ae = [],
        Ye = {
          firstItem: 0,
          lastItem: 0,
          centerItem: 0,
          activeItem: -1,
          activePage: 0
        },
        $e = new d(De[0]),
        Fe = new d(be[0]),
        ze = new d(_e[0]),
        Le = new d(xe[0]),
        Ne = "basic" === me.itemNav,
        Be = "forceCentered" === me.itemNav,
        je = "centered" === me.itemNav || Be,
        qe = !we && (Ne || je || Be),
        We = me.scrollSource ? t(me.scrollSource) : De,
        Ve = me.dragSource ? t(me.dragSource) : De,
        He = t(me.forward),
        Re = t(me.backward),
        Xe = t(me.prev),
        Je = t(me.next),
        Qe = t(me.prevPage),
        Ke = t(me.nextPage),
        Ge = {},
        Ze = {},
        ti = {},
        ei = {},
        ii = {
          released: 1
        },
        ni = {
          last: 0,
          delta: 0,
          resetTime: 200
        },
        ai = 0,
        si = 0,
        ri = 0,
        oi = 0;
      we || (e = De[0]), ye.initialized = 0, ye.frame = e, ye.slidee = be[0], ye.pos = Te, ye.rel = Ye, ye.items = Ae, ye.pages = Pe, ye.isPaused = 0, ye.options = me, ye.dragging = ii, ye.reload = $, ye.getPos = function(t) {
        if (qe) {
          var e = q(t);
          return -1 !== e ? Ae[e] : !1
        }
        var i = be.find(t).eq(0);
        if (i[0]) {
          var n = me.horizontal ? i.offset().left - be.offset().left : i.offset().top - be.offset().top,
            a = i[me.horizontal ? "outerWidth" : "outerHeight"]();
          return {
            start: n,
            center: n - ke / 2 + a / 2,
            end: n - ke + a,
            size: a
          }
        }
        return !1
      }, ye.moveBy = function(t) {
        ei.speed = t, !ii.init && ei.speed && Te.cur !== (ei.speed > 0 ? Te.end : Te.start) && (ei.lastTime = +new Date, ei.startPos = Te.cur, te("button"), ii.init = 1, pe("moveStart"), y(oi), B())
      }, ye.stop = function() {
        "button" === ii.source && (ii.init = 0, ii.released = 1)
      }, ye.prev = function() {
        ye.activate(Ye.activeItem - 1)
      }, ye.next = function() {
        ye.activate(Ye.activeItem + 1)
      }, ye.prevPage = function() {
        ye.activatePage(Ye.activePage - 1)
      }, ye.nextPage = function() {
        ye.activatePage(Ye.activePage + 1)
      }, ye.slideBy = function(t, e) {
        t && (qe ? ye[je ? "toCenter" : "toStart"](c((je ? Ye.centerItem : Ye.firstItem) + me.scrollBy * t, 0, Ae.length)) : F(Te.dest + t, e))
      }, ye.slideTo = function(t, e) {
        F(t, e)
      }, ye.toStart = function(t, e) {
        j("start", t, e)
      }, ye.toEnd = function(t, e) {
        j("end", t, e)
      }, ye.toCenter = function(t, e) {
        j("center", t, e)
      }, ye.getIndex = q, ye.activate = function(t, e) {
        var i = V(t);
        me.smart && i !== !1 && (je ? ye.toCenter(i, e) : i >= Ye.lastItem ? ye.toStart(i, e) : i <= Ye.firstItem ? ye.toEnd(i, e) : K())
      }, ye.activatePage = function(t, e) {
        l(t) && F(Pe[c(t, 0, Pe.length - 1)], e)
      }, ye.resume = function(t) {
        !me.cycleBy || !me.cycleInterval || "items" === me.cycleBy && !Ae[0] || t < ye.isPaused || (ye.isPaused = 0, ri ? ri = clearTimeout(ri) : pe("resume"), ri = setTimeout(function() {
          switch (pe("cycle"), me.cycleBy) {
            case "items":
              ye.activate(Ye.activeItem >= Ae.length - 1 ? 0 : Ye.activeItem + 1);
              break;
            case "pages":
              ye.activatePage(Ye.activePage >= Pe.length - 1 ? 0 : Ye.activePage + 1)
          }
        }, me.cycleInterval))
      }, ye.pause = function(t) {
        t < ye.isPaused || (ye.isPaused = t || 100, ri && (ri = clearTimeout(ri), pe("pause")))
      }, ye.toggle = function() {
        ye[ri ? "pause" : "resume"]()
      }, ye.set = function(e, i) {
        t.isPlainObject(e) ? t.extend(me, e) : me.hasOwnProperty(e) && (me[e] = i)
      }, ye.add = function(e, i) {
        var n = t(e);
        qe ? (null == i || !Ae[0] || i >= Ae.length ? n.appendTo(be) : Ae.length && n.insertBefore(Ae[i].el), i <= Ye.activeItem && (Ze.active = Ye.activeItem += n.length)) : be.append(n), $()
      }, ye.remove = function(e) {
        if (qe) {
          var i = W(e);
          if (i > -1) {
            Oe.eq(i).remove();
            var n = i === Ye.activeItem;
            i < Ye.activeItem && (Ze.active = --Ye.activeItem), $(), n && (Ze.active = null, ye.activate(Ye.activeItem))
          }
        } else t(e).remove(), $()
      }, ye.moveAfter = function(t, e) {
        J(t, e, 1)
      }, ye.moveBefore = function(t, e) {
        J(t, e)
      }, ye.on = function(t, e) {
        if ("object" === a(t))
          for (var i in t) t.hasOwnProperty(i) && ye.on(i, t[i]);
        else if ("function" === a(e))
          for (var n = t.split(" "), s = 0, r = n.length; r > s; s++) Ge[n[s]] = Ge[n[s]] || [], -1 === Q(n[s], e) && Ge[n[s]].push(e);
        else if ("array" === a(e))
          for (var o = 0, l = e.length; l > o; o++) ye.on(t, e[o])
      }, ye.one = function(t, e) {
        function i() {
          e.apply(ye, arguments), ye.off(t, i)
        }
        ye.on(t, i)
      }, ye.off = function(t, e) {
        if (e instanceof Array)
          for (var i = 0, n = e.length; n > i; i++) ye.off(t, e[i]);
        else
          for (var a = t.split(" "), s = 0, r = a.length; r > s; s++)
            if (Ge[a[s]] = Ge[a[s]] || [], null == e) Ge[a[s]].length = 0;
            else {
              var o = Q(a[s], e); - 1 !== o && Ge[a[s]].splice(o, 1)
            }
      }, ye.destroy = function() {
        return D.add(We).add(xe).add(_e).add(Ie).add(He).add(Re).add(Xe).add(Je).add(Qe).add(Ke).unbind("." + m), Xe.add(Je).add(Qe).add(Ke).removeClass(me.disabledClass), Oe && Oe.eq(Ye.activeItem).removeClass(me.activeClass), Ie.empty(), we || (De.unbind("." + m), $e.restore(), Fe.restore(), ze.restore(), Le.restore(), t.removeData(e, m)), Ae.length = Pe.length = 0, Ze = {}, ye.initialized = 0, ye
      }, ye.init = function() {
        if (!ye.initialized) {
          ye.on(v);
          var t = ["overflow", "position"],
            e = ["position", "webkitTransform", "msTransform", "transform", "left", "top", "width", "height"];
          $e.save.apply($e, t), ze.save.apply(ze, t), Fe.save.apply(Fe, e), Le.save.apply(Le, e);
          var i = xe;
          return we || (i = i.add(be), De.css("overflow", "hidden"), u || "static" !== De.css("position") || De.css("position", "relative")), u ? f && i.css(u, f) : ("static" === _e.css("position") && _e.css("position", "relative"), i.css({
            position: "absolute"
          })), me.forward && He.on(x, re), me.backward && Re.on(x, re), me.prev && Xe.on(_, re), me.next && Je.on(_, re), me.prevPage && Qe.on(_, re), me.nextPage && Ke.on(_, re), We.on(T, le), _e[0] && _e.on(_, he), qe && me.activateOn && De.on(me.activateOn + "." + m, "*", de), Ie[0] && me.activatePageOn && Ie.on(me.activatePageOn + "." + m, "*", ue), Ve.on(b, {
            source: "slidee"
          }, ee), xe && xe.on(b, {
            source: "handle"
          }, ee), D.bind("keydown." + m, ce), we || (De.on("mouseenter." + m + " mouseleave." + m, fe), De.on("scroll." + m, o)), ye.initialized = 1, $(), me.cycleBy && !we && ye[me.startPaused ? "pause" : "resume"](), ye
        }
      }
    }

    function a(t) {
      return null == t ? String(t) : "object" == typeof t || "function" == typeof t ? Object.prototype.toString.call(t).match(/\s([a-z]+)/i)[1].toLowerCase() || "object" : typeof t
    }

    function s(t, e) {
      t.preventDefault(), e && t.stopPropagation()
    }

    function r(e) {
      s(e, 1), t(this).off(e.type, r)
    }

    function o() {
      this.scrollLeft = 0, this.scrollTop = 0
    }

    function l(t) {
      return !isNaN(parseFloat(t)) && isFinite(t)
    }

    function h(t, e) {
      return 0 | P(String(t.css(e)).replace(/[^\-0-9.]/g, ""))
    }

    function c(t, e, i) {
      return e > t ? e : t > i ? i : t
    }

    function d(t) {
      var e = {};
      return e.style = {}, e.save = function() {
        if (t) {
          for (var i = 0; i < arguments.length; i++) e.style[arguments[i]] = t.style[arguments[i]];
          return e
        }
      }, e.restore = function() {
        if (t) {
          for (var i in e.style) e.style.hasOwnProperty(i) && (t.style[i] = e.style[i]);
          return e
        }
      }, e
    }
    var u, f, p, g = "sly",
      v = "Sly",
      m = g,
      y = e.cancelAnimationFrame || e.cancelRequestAnimationFrame,
      w = e.requestAnimationFrame,
      D = t(document),
      b = "touchstart." + m + " mousedown." + m,
      k = "mousemove." + m + " mouseup." + m,
      C = "touchmove." + m + " touchend." + m,
      T = (document.implementation.hasFeature("Event.wheel", "3.0") ? "wheel." : "mousewheel.") + m,
      _ = "click." + m,
      x = "mousedown." + m,
      M = ["INPUT", "SELECT", "BUTTON", "TEXTAREA"],
      U = [],
      S = Math.abs,
      I = Math.sqrt,
      E = Math.pow,
      P = Math.round,
      O = Math.max,
      A = Math.min,
      Y = 0;
    D.on(T, function() {
        Y = +new Date
      }),
      function(t) {
        function e(t) {
          var e = (new Date).getTime(),
            n = Math.max(0, 16 - (e - i)),
            a = setTimeout(t, n);
          return i = e, a
        }
        w = t.requestAnimationFrame || t.webkitRequestAnimationFrame || e;
        var i = (new Date).getTime(),
          n = t.cancelAnimationFrame || t.webkitCancelAnimationFrame || t.clearTimeout;
        y = function(e) {
          n.call(t, e)
        }
      }(window),
      function() {
        function t(t) {
          for (var n = 0, a = e.length; a > n; n++) {
            var s = e[n] ? e[n] + t.charAt(0).toUpperCase() + t.slice(1) : t;
            if (null != i.style[s]) return s
          }
        }
        var e = ["", "webkit", "moz", "ms", "o"],
          i = document.createElement("div");
        u = t("transform"), f = t("perspective") ? "translateZ(0) " : ""
      }(), e[v] = n, t.fn[g] = function(e, i) {
        var s, r;
        return t.isPlainObject(e) || (("string" === a(e) || e === !1) && (s = e === !1 ? "destroy" : e, r = Array.prototype.slice.call(arguments, 1)), e = {}), this.each(function(a, o) {
          var l = t.data(o, m);
          l || s ? l && s && l[s] && l[s].apply(l, r) : l = t.data(o, m, new n(o, e, i).init())
        })
      }, n.defaults = {
        horizontal: !1,
        itemNav: null,
        itemSelector: null,
        smart: !1,
        activateOn: null,
        activateMiddle: !1,
        scrollSource: null,
        scrollBy: 0,
        scrollHijack: 300,
        scrollTrap: !1,
        dragSource: null,
        mouseDragging: !1,
        touchDragging: !1,
        releaseSwing: !1,
        swingSpeed: .2,
        elasticBounds: !1,
        interactive: null,
        scrollBar: null,
        dragHandle: !1,
        dynamicHandle: !1,
        minHandleSize: 50,
        clickBar: !1,
        syncSpeed: .5,
        pagesBar: null,
        activatePageOn: null,
        pageBuilder: function(t) {
          return "<li>" + (t + 1) + "</li>"
        },
        forward: null,
        backward: null,
        prev: null,
        next: null,
        prevPage: null,
        nextPage: null,
        cycleBy: null,
        cycleInterval: 5e3,
        pauseOnHover: !1,
        startPaused: !1,
        moveBy: 300,
        speed: 0,
        easing: "swing",
        startAt: 0,
        keyboardNavBy: null,
        draggedClass: "dragged",
        activeClass: "active",
        disabledClass: "disabled"
      }
  }(jQuery, window),
  /*
   * transform: A jQuery cssHooks adding cross-browser 2d transform capabilities to $.fn.css() and $.fn.animate()
   *
   * limitations:
   * - requires jQuery 1.4.3+
   * - Should you use the *translate* property, then your elements need to be absolutely positionned in a relatively positionned wrapper **or it will fail in IE678**.
   * - transformOrigin is not accessible
   *
   * latest version and complete README available on Github:
   * https://github.com/louisremi/jquery.transform.js
   *
   * Copyright 2011 @louis_remi
   * Licensed under the MIT license.
   *
   * This saved you an hour of work?
   * Send me music http://www.amazon.co.uk/wishlist/HNTU0468LQON
   *
   */
  function(t, e, i, n, a) {
    function s(e) {
      e = e.split(")");
      var i, a, s, r = t.trim,
        o = -1,
        l = e.length - 1,
        h = C ? new Float32Array(6) : [],
        c = C ? new Float32Array(6) : [],
        d = C ? new Float32Array(6) : [1, 0, 0, 1, 0, 0];
      for (h[0] = h[3] = d[0] = d[3] = 1, h[1] = h[2] = h[4] = h[5] = 0; ++o < l;) {
        switch (i = e[o].split("("), a = r(i[0]), s = i[1], c[0] = c[3] = 1, c[1] = c[2] = c[4] = c[5] = 0, a) {
          case U + "X":
            c[4] = parseInt(s, 10);
            break;
          case U + "Y":
            c[5] = parseInt(s, 10);
            break;
          case U:
            s = s.split(","), c[4] = parseInt(s[0], 10), c[5] = parseInt(s[1] || 0, 10);
            break;
          case S:
            s = u(s), c[0] = n.cos(s), c[1] = n.sin(s), c[2] = -n.sin(s), c[3] = n.cos(s);
            break;
          case I + "X":
            c[0] = +s;
            break;
          case I + "Y":
            c[3] = s;
            break;
          case I:
            s = s.split(","), c[0] = s[0], c[3] = s.length > 1 ? s[1] : s[0];
            break;
          case E + "X":
            c[2] = n.tan(u(s));
            break;
          case E + "Y":
            c[1] = n.tan(u(s));
            break;
          case P:
            s = s.split(","), c[0] = s[0], c[1] = s[1], c[2] = s[2], c[3] = s[3], c[4] = parseInt(s[4], 10), c[5] = parseInt(s[5], 10)
        }
        d[0] = h[0] * c[0] + h[2] * c[1], d[1] = h[1] * c[0] + h[3] * c[1], d[2] = h[0] * c[2] + h[2] * c[3], d[3] = h[1] * c[2] + h[3] * c[3], d[4] = h[0] * c[4] + h[2] * c[5] + h[4], d[5] = h[1] * c[4] + h[3] * c[5] + h[5], h = [d[0], d[1], d[2], d[3], d[4], d[5]]
      }
      return d
    }

    function r(t) {
      var e, i, a, s = t[0],
        r = t[1],
        o = t[2],
        l = t[3];
      return s * l - r * o ? (e = n.sqrt(s * s + r * r), s /= e, r /= e, a = s * o + r * l, o -= s * a, l -= r * a, i = n.sqrt(o * o + l * l), o /= i, l /= i, a /= i, r * o > s * l && (s = -s, r = -r, a = -a, e = -e)) : e = i = a = 0, [
        [U, [+t[4], +t[5]]],
        [S, n.atan2(r, s)],
        [E + "X", n.atan(a)],
        [I, [e, i]]
      ]
    }

    function o(e, i) {
      var n, a, o, u, p = {
          start: [],
          end: []
        },
        g = -1;
      if (("none" == e || h(e)) && (e = ""), ("none" == i || h(i)) && (i = ""), e && i && !i.indexOf("matrix") && f(e).join() == f(i.split(")")[0]).join() && (p.origin = e, e = "", i = i.slice(i.indexOf(")") + 1)), e || i) {
        if (e && i && c(e) != c(i)) p.start = r(s(e)), p.end = r(s(i));
        else
          for (e && (e = e.split(")")) && (n = e.length), i && (i = i.split(")")) && (n = i.length); ++g < n - 1;) e[g] && (a = e[g].split("(")), i[g] && (o = i[g].split("(")), u = t.trim((a || o)[0]), d(p.start, l(u, a ? a[1] : 0)), d(p.end, l(u, o ? o[1] : 0));
        return p
      }
    }

    function l(t, e) {
      var i, n = +!t.indexOf(I),
        a = t.replace(/e[XY]/, "e");
      switch (t) {
        case U + "Y":
        case I + "Y":
          e = [n, e ? parseFloat(e) : n];
          break;
        case U + "X":
        case U:
        case I + "X":
          i = 1;
        case I:
          e = e ? (e = e.split(",")) && [parseFloat(e[0]), parseFloat(e.length > 1 ? e[1] : t == I ? i || e[0] : n + "")] : [n, n];
          break;
        case E + "X":
        case E + "Y":
        case S:
          e = e ? u(e) : 0;
          break;
        case P:
          return r(e ? f(e) : [1, 0, 0, 1, 0, 0])
      }
      return [
        [a, e]
      ]
    }

    function h(t) {
      return _.test(t)
    }

    function c(t) {
      return t.replace(/(?:\([^)]*\))|\s/g, "")
    }

    function d(t, e, i) {
      for (; i = e.shift();) t.push(i)
    }

    function u(t) {
      return ~t.indexOf("deg") ? parseInt(t, 10) * (2 * n.PI / 360) : ~t.indexOf("grad") ? parseInt(t, 10) * (n.PI / 200) : parseFloat(t)
    }

    function f(t) {
      return t = /([^,]*),([^,]*),([^,]*),([^,]*),([^,p]*)(?:px)?,([^)p]*)(?:px)?/.exec(t), [t[1], t[2], t[3], t[4], t[5], t[6]]
    }
    for (var p, g, v, m, y = i.createElement("div"), w = y.style, D = "Transform", b = ["O" + D, "ms" + D, "Webkit" + D, "Moz" + D], k = b.length, C = ("Float32Array" in e), T = /Matrix([^)]*)/, _ = /^\s*matrix\(\s*1\s*,\s*0\s*,\s*0\s*,\s*1\s*(?:,\s*0(?:px)?\s*){2}\)\s*$/, x = "transform", M = "transformOrigin", U = "translate", S = "rotate", I = "scale", E = "skew", P = "matrix"; k--;) b[k] in w && (t.support[x] = p = b[k], t.support[M] = p + "Origin");
    p || (t.support.matrixFilter = g = "" === w.filter), t.cssNumber[x] = t.cssNumber[M] = !0, p && p != x ? (t.cssProps[x] = p, t.cssProps[M] = p + "Origin", p == "Moz" + D ? v = {
      get: function(e, i) {
        return i ? t.css(e, p).split("px").join("") : e.style[p]
      },
      set: function(t, e) {
        t.style[p] = /matrix\([^)p]*\)/.test(e) ? e.replace(/matrix((?:[^,]*,){4})([^,]*),([^)]*)/, P + "$1$2px,$3px") : e
      }
    } : /^1\.[0-5](?:\.|$)/.test(t.fn.jquery) && (v = {
      get: function(e, i) {
        return i ? t.css(e, p.replace(/^ms/, "Ms")) : e.style[p]
      }
    })) : g && (v = {
      get: function(e, i, n) {
        var s, r, o = i && e.currentStyle ? e.currentStyle : e.style;
        return o && T.test(o.filter) ? (s = RegExp.$1.split(","), s = [s[0].split("=")[1], s[2].split("=")[1], s[1].split("=")[1], s[3].split("=")[1]]) : s = [1, 0, 0, 1], t.cssHooks[M] ? (r = t._data(e, "transformTranslate", a), s[4] = r ? r[0] : 0, s[5] = r ? r[1] : 0) : (s[4] = o ? parseInt(o.left, 10) || 0 : 0, s[5] = o ? parseInt(o.top, 10) || 0 : 0), n ? s : P + "(" + s + ")"
      },
      set: function(e, i, n) {
        var a, r, o, l, h = e.style;
        n || (h.zoom = 1), i = s(i), r = ["Matrix(M11=" + i[0], "M12=" + i[2], "M21=" + i[1], "M22=" + i[3], "SizingMethod='auto expand'"].join(), o = (a = e.currentStyle) && a.filter || h.filter || "", h.filter = T.test(o) ? o.replace(T, r) : o + " progid:DXImageTransform.Microsoft." + r + ")", t.cssHooks[M] ? t.cssHooks[M].set(e, i) : ((l = t.transform.centerOrigin) && (h["margin" == l ? "marginLeft" : "left"] = -(e.offsetWidth / 2) + e.clientWidth / 2 + "px", h["margin" == l ? "marginTop" : "top"] = -(e.offsetHeight / 2) + e.clientHeight / 2 + "px"), h.left = i[4] + "px", h.top = i[5] + "px")
      }
    }), v && (t.cssHooks[x] = v), m = v && v.get || t.css, t.fx.step.transform = function(e) {
      var i, a, s, r, l = e.elem,
        h = e.start,
        c = e.end,
        d = e.pos,
        u = "",
        f = 1e5;
      for (h && "string" != typeof h || (h || (h = m(l, p)), g && (l.style.zoom = 1), c = c.split("+=").join(h), t.extend(e, o(h, c)), h = e.start, c = e.end), i = h.length; i--;) switch (a = h[i], s = c[i], r = 0, a[0]) {
        case U:
          r = "px";
        case I:
          r || (r = ""), u = a[0] + "(" + n.round((a[1][0] + (s[1][0] - a[1][0]) * d) * f) / f + r + "," + n.round((a[1][1] + (s[1][1] - a[1][1]) * d) * f) / f + r + ")" + u;
          break;
        case E + "X":
        case E + "Y":
        case S:
          u = a[0] + "(" + n.round((a[1] + (s[1] - a[1]) * d) * f) / f + "rad)" + u
      }
      e.origin && (u = e.origin + u), v && v.set ? v.set(l, u, 1) : l.style[p] = u
    }, t.transform = {
      centerOrigin: "margin"
    }
  }(jQuery, window, document, Math),
  function() {
    $.fn.own_slider = function(t) {
      var e, i, n, a, s, r, o, l, h, c, d, u, f, p;
      return p = $.extend({
        activeSlideIdx: 1,
        shownSlidesCount: 3
      }, t), a = $(this), a.css({
        overflow: "hidden",
        width: "100%"
      }), h = a.find("ul"), h.css("position", "relative"), c = a.find(".b-slider__next"), u = a.find(".b-slider__prev"), d = $("#pages"), l = a.find("li"), o = l.eq(0).outerWidth(!0) || l.eq(0).outerWidth() + l.eq(0).css("marginLeft") + l.eq(0).css("marginRight"), n = function() {
        var t, e, i, n;
        return e = a.width(), n = h.width(), i = p.shownSlidesCount - 1, t = h.find(".active").outerWidth(!0) || h.find(".active").outerWidth() + h.find(".active").css("marginLeft") + h.find(".active").css("marginRight"), l.not(":hidden").length > 1 ? h.css("marginLeft", (e - (o * i + t)) / 2) : h.css("marginLeft", (e - t) / 2)
      }, i = function() {
        var t;
        return t = 0, l.not(":hidden").each(function() {
          return t += $(this).outerWidth(!0) || $(this).outerWidth() + $(this).css("marginLeft") + $(this).css("marginRight")
        }), h.css({
          width: t,
          left: 0
        }), n()
      }, s = function() {
        return $.isNumeric(p.activeSlideIdx) ? parseInt(p.activeSlideIdx) <= l.length ? p.activeSlideIdx : 0 : Math.ceil(l.length / 2 - 1)
      }, f = function() {
        var t, e;
        return t = s(), e = l.not(":hidden").eq(l.not(":hidden").eq(t).length ? t : 0), e.addClass("active").siblings().removeClass("active"), e.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
          return i()
        })
      }, f(), r = function() {
        var t, e;
        return e = $("#pages").find(".active"), e && e.length ? (t = e.data("action"), l.removeClass("active"), l.each(function() {
          var e, i, n, a;
          for (a = $(this).data("type").split(", "), i = 0, n = a.length; n > i; i++)
            if (e = a[i], e === t) return void $(this).show();
          return $(this).hide()
        }), l.not(":hidden").length ? $("#nothing-to-show").hide() : $("#nothing-to-show").show()) : l.each(function() {
          return $(this).show()
        }), f()
      }, e = !1, c.on("click", function() {
        var t, i;
        if (!$(this).hasClass("disabled")) return t = a.find(".active"), i = t.nextAll(":not(:hidden):first"), i && i.length ? (e = !0, h.css({
          left: parseInt($("ul", a).css("left")) - o
        }), i.addClass("active").siblings().removeClass("active"), u.hasClass("disabled") && u.removeClass("disabled"), i.nextAll(":not(:hidden):first") && i.nextAll(":not(:hidden):first").length || $(this).addClass("disabled"), i.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
          return e = !1
        })) : void 0
      }), u.on("click", function() {
        var t, i;
        if (!$(this).hasClass("disabled")) return t = a.find(".active"), i = t.prevAll(":not(:hidden):first"), i && i.length ? (e = !0, h.css({
          left: parseInt($("ul", a).css("left")) + o
        }), i.addClass("active").siblings().removeClass("active"), c.hasClass("disabled") && c.removeClass("disabled"), i.prevAll(":not(:hidden):first") && i.prevAll(":not(:hidden):first").length || $(this).addClass("disabled"), i.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
          return e = !1
        })) : void 0
      }), d.on("click", function(t) {
        var e;
        return e = $(t.target).data("action") ? $(t.target) : $(t.target).parents("[data-action]"), e.toggleClass("active").siblings().removeClass("active"), r(), l.not(":hidden").length > 1 ? u.removeClass("disabled") : u.addClass("disabled"), l.not(":hidden").length > 2 ? c.removeClass("disabled") : c.addClass("disabled")
      }), $(window).on("resize", function() {
        return n()
      })
    }
  }.call(this),
  function() {
    var t, e;
    t = function(e) {
      return setTimeout(function() {
        var i, n;
        return n = e.find(".active") || $("span", e).first(), i = n.next().length ? n.next() : $("span", e).first(), i.css({
          position: "relative",
          opacity: 0,
          display: "inline-block",
          transform: "translateY(20px)"
        }), n.fadeOut(), i.addClass("active").siblings().removeClass("active"), i.animate({
          opacity: 1,
          transform: "translateY(0px)"
        }, 800, function() {
          return t($("#logotype"))
        })
      }, 5e3)
    }, e = function() {
      return $("#dynamic").text($(window).width() > 980 ? ".b-skew-top:before{border-left-width: " + $(window).width() + "px;} .b-skew-bottom:after{border-right-width: " + $(window).width() + "px;}" : ".b-skew-top:before{border-left-width: 980px;} .b-skew-bottom:after{border-right-width: 980px;}")
    }, $(document).ready(function() {
      var i;
      return $("<style type='text/css' id='dynamic' />").appendTo("head"), e(), $("#title-slide") && setTimeout(function() {
        return $("#title-slide").fadeOut()
      }, 10000), t($("#logotype")), $("#date").datepicker({
        format: "mm.dd.yyyy",
        autoclose: !0
      }), $("img.svg").each(function() {
        var t, e, i, n;
        t = $(this), i = t.attr("id"), e = t.attr("class"), n = t.attr("src"), $.get(n, function(n) {
          var a;
          a = $(n).find("svg"), "undefined" != typeof i && (a = a.attr("id", i)), "undefined" != typeof e && (a = a.attr("class", e + " replaced-svg")), a = a.removeAttr("xmlns:a"), t.replaceWith(a)
        }, "xml")
      }), $("#slider") && $("#slider").length && $("#slider").own_slider(), $("#projects") && $("#projects").length && $("#projects").own_slider({
        activeSlideIdx: 2,
        shownSlidesCount: 5
      }), $("#photos") && $("#photos").length && (i = imagesLoaded($("#photos img")), i.on("always", function() {
        return window.photos = new Sly("#photos", {
          horizontal: 1,
          itemNav: "forceCentered",
          activateMiddle: 1,
          next: "#photos .b-carousel__next",
          prev: "#photos .b-carousel__prev",
          smart: 1,
          activateOn: "click",
          mouseDragging: 1,
          touchDragging: 1,
          releaseSwing: 1,
          startAt: 3,
          speed: 300,
          elasticBounds: 1,
          dragHandle: 1,
          dynamicHandle: 1,
          clickBar: 1
        }).init()
      }))
    }), $(window).on("resize", function() {
      return e(), window.photos ? window.photos.reload() : void 0
    })
  }.call(this);

$(function(){
  setTimeout(function() {
    $(".unvisible").css("opacity", "1");
  }, 10000);
})
