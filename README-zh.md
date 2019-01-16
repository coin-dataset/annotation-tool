# 标注工具操作文档

## 文件结构

```
.
├── input 标注所需文件（可参考示例文件进行自定义）
├──── video 截帧图片文件夹
├────── $urlId（以frame.txt内的urlId命名）
├──────── $frame （以frame.txt内的对应$urlId的frame命名）
├──── frame.txt (urlId,frame,time)
├──── label.txt (tagId,tag)
├──── video.txt (urlId,url)
├── lib 源码
└── index.html  软件入口
```

## 操作

### 一、准备标注文件

> 1、video.txt

```
urlId,url
自定义且唯一,youtobe视频id+.mp4
```

> 2、label.txt

```
tagId,tag
自定义且唯一,标签名
```

> 3、frame.txt

```
urlId,frame,time
自定义且唯一与video.txt内的urlId对应,截帧图片名,截帧时间
```

> 4、video 文件夹

```
video 下的文件夹以 frame.txt 内的 urlId 命名，
urlId 内存放截帧图片，并以 frame.txt 内的对应 urlId 的 frame 命名
```

`注意：`video文件夹 必须放在input文件夹内

### 二、导入标注文件

![](./images/upload.png)

> 1、打开 `index.html`

> 2、依次点击 `upload video file`、`upload label file`、`upload frame file`上传 对应的`video.txt` ，`label.txt`，`frame.txt`文件

> 3、点击 `input` 导入文件（若文件格式错误，将会报错，上传失败）

### 三、开始标注

#### 1）状态列表

![](./images/states.png)

| videoID | videoName | time     | operation |
| ------- | --------- | -------- | --------- |
| urldId  | url       | 标注次数 | 操作按钮  |

> 1、unlabeled 未标注

点击 `label` 打开标注页面

点击 `delete` 删除该视频

> 2、labeled 已标注

点击 `checkout` 打开标注页面，进行检查

点击 `delete` 删除该视频

> 3、checked 已检查

点击 `cancle` 取消 checked 状态，视频恢复 `labeled` 状态

> 4、deleted 已检查

点击 `restore` 取消 `deleted` 状态，若 `time>1` 视频恢复 `unlabeled` 状态，若 `time=0` 视频恢复 `labeled` 状态

#### 2）标注页面

##### 图片标注

![](./images/imageLabel.png)

> 操作按钮

1、`setting` 按钮

可配置 `行数` 以及 `截帧间隔`

`注意：`该操作将清空未保存标注信息，请及时保存 

2、`save` 按钮

可保存当前标注信息

3、`delete` 按钮

删除当前视频

> 标注方法

1、选中截帧图片（可跨选：点击 `开始时间` 与 `结束时间` 的两张图片，即可选中该时间段内所有截帧图片）

2、选择并点击 `tags` 部分的标签

3、删除已标注信息：选中已标注的某个图片 或 `labels` 部分的对应信息，点击 `delete tag` 按钮，进行删除

4、结果展示：

    1) 每个截帧图片上方将展示其选中的标签
    2) 标注结果统一展示在 `labels` 部分

##### 视频标注

![](./images/videoLabel.png)

> 操作按钮

1、`save` 按钮

可保存当前标注信息

2、`delete` 按钮

删除当前视频

> 标注方法

1、点击 上方视频名（video(check to play)： CQcWjWkaSfA.mp4），打开视频标注页面

2、鼠标点击标注条，选中 `开始时间` 与 `结束时间`（对应视频进度条）

3、选择并点击 `tags` 部分的标签

4、删除已标注信息：选中已标注的某段标注条 或 labels部分的对应信息，点击 `delete tag` 按钮，进行删除

5、结果展示：

    1) 当鼠标放在标注条已标注的某段上时，将展示其选中的标签
    2) 标注结果统一展示在 `labels` 部分

### 四、导出标注文件

点击 `output` 可导出文件（导出文件可作为导入文件进行标注检查）