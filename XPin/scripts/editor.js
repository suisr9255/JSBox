/*
编辑器
点击进入创建
长按进入查看

图片
滑动返回
双击分享
长按保存
*/

let ui = require("./ui");
const ver = parseInt($device.info.version.split(".")[0]) - 12;
const textColor = ui.color.general;

function clipEditor(text, show=false) {
  let TextViewHeight = $device.info.screen.height - 500;

  $ui.render({
    props: {
      id: "clipView",
      title: "Clip Editor",
      bgcolor: ver ? ui.color.editor_bg : $color("#FFFFFF"),
      navBarHidden: 1
    },
    views: [
      {
        type: "text",
        props: {
          id: "clipContent",
          type: $kbType.default,
          bgcolor: ver ? ui.color.editor_text_bg : $rgba(100, 100, 100, 0.1),
          textColor,
          darkKeyboard: $device.isDarkMode ? true : false,
          font: $font(15),
          radius: 10,
          accessoryView: {
            type: "view",
            props: {
              height: 40,
              bgcolor: $device.isDarkMode ? $color("#080808") : $color("#eeeeee"),
              borderWidth: 0.5,
              borderColor: $device.isDarkMode ? $color("clear") : $color("#cccccc")
            },
            views: [
              {
                type: "button",
                props: {
                  id: "UndoButton",
                  title: "⃔",
                  radius: 6,
                  font: $font(14),
                  bgcolor: $device.isDarkMode ? $color("#404040") : $color("#ffffff"),
                  borderWidth: 0.5,
                  borderColor: $device.isDarkMode ? $color("#606060") : $color("#cccccc")
                },
                layout: function(make, view) {
                  make.top.inset(5);
                  make.left.inset(8);
                  make.width.equalTo(35);
                  make.centerY.equalTo(view.super);
                },
                events: {
                  tapped: function(sender) {
                    $device.taptic(0);
                    if (um.$canUndo()) {
                      um.$undo();
                    } else {
                      $ui.error("Nothing to Undo!", 0.6);
                    }
                  }
                }
              },
              {
                type: "button",
                props: {
                  id: "RedoButton",
                  title: "⃕",
                  radius: 6,
                  font: $font(14),
                  bgcolor: $device.isDarkMode ? $color("#404040") : $color("#ffffff"),
                  borderWidth: 0.5,
                  borderColor: $device.isDarkMode ? $color("#606060") : $color("#cccccc")
                },
                layout: function(make, view) {
                  make.top.equalTo($("UndoButton").top);
                  make.left.equalTo($("UndoButton").right).inset(5);
                  make.width.equalTo($("UndoButton").width);
                  make.centerY.equalTo(view.super);
                },
                events: {
                  tapped: function(sender) {
                    $device.taptic(0);
                    if (um.$canRedo()) {
                      um.$redo();
                    } else {
                      $ui.error("Nothing to Redo!", 0.6);
                    }
                  }
                }
              },
              {
                type: "button",
                props: {
                  title: "🌁",
                  id: "ImageButton",
                  font: $font("bold", 20),
                  bgcolor: $color("clear"),
                  hidden: 1
                },
                layout: function(make, view) {
                  make.top.bottom.inset(0);
                  make.centerX.equalTo(view.super).offset(22);
                },
                events: {
                  tapped: function(sender) {
                    showImage($clipboard.image);
                  }
                }
              },
              {
                type: "button",
                props: {
                  id: "ShareButton",
                  icon: $icon("022", $device.isDarkMode ? $color("#C0C0C0") : $color("gray"), $size(20, 20)),
                  font: $font("bold", 25),
                  bgcolor: $color("clear"),
                  hidden: 0
                },
                layout: function(make, view) {
                  make.top.bottom.inset(0);
                  make.right.equalTo($("ImageButton").left).inset(10);
                },
                events: {
                  tapped: function(sender) {
                    if ($("clipContent").text.length > 0) {
                      let ShareText = $("clipContent").selectedRange.length > 0 ? $("clipContent").text.substr($("clipContent").selectedRange.location, $("clipContent").selectedRange.length) : $("clipContent").text;
                      $share.sheet(ShareText)
                    } else {
                      $ui.error("No Content!", 0.5);
                    }
                  }
                }
              },
              {
                type: "button",
                props: {
                  id: "QRButton",
                  icon: $icon("017", $device.isDarkMode ? $color("#C0C0C0") : $color("gray"), $size(20, 20)),
                  font: $font("bold", 25),
                  bgcolor: $color("clear"),
                  hidden: 0
                },
                layout: function(make, view) {
                  make.top.bottom.inset(0);
                  make.right.equalTo($("ShareButton").left).inset(12);
                },
                events: {
                  tapped: function(sender) {
                    if ($("clipContent").text.length > 0) {
                      let QRText = $("clipContent").selectedRange.length > 0 ? $("clipContent").text.substr($("clipContent").selectedRange.location, $("clipContent").selectedRange.length) : $("clipContent").text;
                      let QRimage = $qrcode.encode(QRText);
                      showImage(QRimage.png);
                    } else {
                      $ui.error("No Content!", 0.5);
                    }
                  }
                }
              },
              {
                type: "button",
                props: {
                  title: "🔗",
                  id: "LinkButton",
                  font: $font("bold", 13),
                  bgcolor: $color("clear"),
                  hidden: 1
                },
                layout: function(make, view) {
                  make.top.bottom.inset(0);
                  make.right.equalTo($("QRButton").left).inset(8);
                },
                events: {
                  tapped: async function(sender) {
                    if (sender.info.length == 1) {
                      $app.openURL(sender.info[0]);
                    } else {
                      let result = await $ui.menu({ items: sender.info });
                      $app.openURL(result.title);
                    }
                  }
                }
              },
              {
                type: "button",
                props: {
                  id: "saveButton",
                  title: "Save",
                  font: $font("bold", 14),
                  bgcolor: $device.isDarkMode ? $color($cache.get("dark")) : $color("tint"),
                  borderWidth: 0.5,
                  borderColor: $device.isDarkMode ? $color("clear") : $color("#cccccc")
                },
                layout: function(make, view) {
                  make.top.equalTo($("UndoButton").top);
                  make.right.inset(5);
                  make.width.equalTo(60);
                  make.centerY.equalTo(view.super);
                },
                events: {
                  tapped: function(sender) {
                    saveClip($("clipContent").text);
                  }
                }
              },
              {
                type: "button",
                props: {
                  id: "cancelButton",
                  title: "Cancel",
                  font: $font("bold", 14),
                  bgcolor: $device.isDarkMode ? $color("#383838") : $color("lightGray"),
                  borderWidth: 0.5,
                  borderColor: $device.isDarkMode ? $color("clear") : $color("#cccccc")
                },
                layout: function(make, view) {
                  make.top.equalTo($("UndoButton").top);
                  make.right.equalTo($("saveButton").left).inset(8);
                  make.width.equalTo($("saveButton").width);
                  make.centerY.equalTo(view.super);
                },
                events: {
                  tapped: function(sender) {
                    $("clipContent").blur();
                    closeView();
                  }
                }
              }
            ]
          }
        },
        layout: function(make, view) {
          make.top.equalTo(view.super.safeAreaTop).offset(20);
          make.right.left.inset(10);
          make.height.equalTo(TextViewHeight);
        },
        events: {
          ready: function(sender) {
            if (show && text && text != "") {
              sender.text = text;
            }
            if (show && !text && $clipboard.image) {
              showImage($clipboard.image);
            } else {
              sender.focus();
            }
          }
        }
      }
    ]
  });
  let um = $("clipContent").runtimeValue().$undoManager();

  if (text) {
    let links = $detector.link(text);
    if(links.length > 0){
      $("LinkButton").hidden = 0;
      $("LinkButton").info = links;
    }
  }

  if ($clipboard.image) {
    $("ImageButton").hidden = 0;
  }

  $widget.height = TextViewHeight + 20;
}

function showImage(imageData) {
  let ratio = imageData.image.size.height/imageData.image.size.width;
  $("clipContent").blur();
  let initLocation = new Array;
  $ui.push({
    props: {
      id: "QRImageView",
      bgcolor: ver ? ui.color.editor_bg : $color("#FFFFFF"),
      navBarHidden: 1
    },
    views: [
      {
        type: "image",
        props: {
          bgcolor: ver ? ui.color.editor_bg : $color("#FFFFFF"),
          data: imageData
        },
        layout: function(make, view) {
          make.center.equalTo(view.super);
          make.size.equalTo($size(($device.info.screen.width-100), ($device.info.screen.width-100)*ratio));
        }
      }
    ],
    events: {
      touchesBegan: function(sender, location) {
        initLocation = location;
      },
      touchesEnded: function(sender, location) {
        if (Math.abs(location.x - initLocation.x) > 2 || Math.abs(location.y - initLocation.y) > 2) {
          $ui.pop();
          $delay(0.6, function() {
            $("clipContent").focus();
          })
        }
      },
      doubleTapped: function(sender) {
        $share.sheet({
          item: ["Image.png", imageData],
          handler: function(success) {
            if (success) {
              $ui.pop();
              $delay(0.6, function() {
                $("clipContent").focus();
              })
            }
          }
        })
      },
      longPressed: function(sender) {
        $photo.save({
          data: imageData,
          handler: function(success) {
            $ui.toast("Image Saved", 0.5);
          }
        })
      }
    }
  });
}

function saveClip(text) {
  $clipboard.set({ type: "public.plain-text", value: text });
  $ui.toast("Saved", 0.8);
  $device.taptic(0);
  closeView();
}

function closeView() {
  $("clipView").remove();
  let app = require("./app");
  app.init();
}

module.exports = {
  clipEditor: clipEditor
};