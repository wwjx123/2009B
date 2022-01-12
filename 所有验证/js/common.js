// @描述 indexedDB 数据库函数
function DBOperate(lists){
    this.nameDB = 'pet';
    this.versionDB = 20220106;
    this.lists = lists || ['dog','cat','fish','turtle']
}

// 构造函数原型
DBOperate.prototype = {
    idb : null,
    openDB : function(){
        const request = indexedDB.open(this.nameDB,this.versionDB)
        const self = this;
        request.onsuccess = function(e){
            self.idb = e.target.result;
            console.log('数据库连接成功')
        }
        request.onerror = function(){
            console.log('数据库连接失败')
        }
        request.onupgradeneeded = function(e){
            self.idb = e.target.result;
            const tx = self.idb.transaction;
            let store;
            self.lists.forEach(el=>{
                if(!self.idb.objectStoreNames.contains(el)){
                    store = self.idb.createObjectStore(el,{
                        keyPath : 'id',
                        autoIncrement : true
                    })
                    store.createIndex('name','name',{
                        upique : true
                    })
                    store.createIndex('pet','pet',{
                        upique : false
                    })
                    store.createIndex('nickname','nickname',{
                        upique : false
                    })
                    store.createIndex('age','age',{
                        upique : false
                    })
                    store.createIndex('color','color',{
                        upique : false
                    })
                }
            })
        }
    },
    /*
        // @描述  查询数据库
        // @参数  list 对象仓库(表)
        // @参数  bd 查询范围(lowerBound,only)
        // @参数  val 要查询的文本框的值
        // @参数  index 索引
        // @参数  callback 回调函数
        // @示例  hmd.queryDB('dog','only',$username.val(),'username',function(){})
    */
    queryDB : function(list,bd,val,index,callback){
        const tx = this.idb.transaction([list],'readonly')
        const store = tx.objectStore(list)
        const range = IDBKeyRange[bd](val);
        const request = store.index(index).openCursor(range);
        let flag = false;
        request.onsuccess = function(e){
            const cursor = e.target.result;
            if(cursor){
                flag = true;
                callback(cursor)
                cursor.continue();
            }else{
                flag === false && callback()
                console.log('搜索结束! ')
            }
        }
    },
    // @描述  插入数据
    // @参数  list：对象仓库(表)
    // @参数  obj：插入的数据(键值对)
    // @参数  callback：回调函数
    insertDB : function(list,obj,callback){
        const tx = this.idb.transaction([list],'readwrite')
        const store = tx.objectStore(list)
        store.put(obj)
        tx.onabort = function(){
            console.log('添加数据失败! ')
        },
        tx.oncomplete = function(){
            console.log('添加数据成功! ')
            callback && callback()
        }
    },
    // @描述  删除对象仓库中的数据
    // @参数  list对象仓库(表)
    // @参数  index id 索引(必须是数字类型)
    deleteDB : function(list,index){
        const tx = this.idb.transaction([list],'readwrite');
        const store = tx.objectStore(list)
        store.delete(index);
        tx.onsuccess = function(){
            console.log('删除成功!')
        }
        tx.onabort = function(){
            console.log('删除失败!')
        }
    },
    init : function(){
        this.openDB()
    }
}

this.hmd = new DBOperate();
this.hmd.init();