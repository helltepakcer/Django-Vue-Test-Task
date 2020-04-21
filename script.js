Vue.component('task', {
    props: ['data'],
    methods: {
        done() {
            this.$emit('done');
        },
        db_delete() {
            this.$emit('db_delete');
        },
        status_changer(){
            this.$emit('status_changer');
        },
        bulk_deleter(){
            this.$emit('bulk_deleter')
        },
        bulk_visual_deleter(){
            this.$emit('bulk_visual_deleter')
        },
        add_task(){
            this.$emit('add_task')
        },


    },
    template: `
  <label class="container whelper">{{ data.title }}
    <input type="checkbox" :id="data.id" :checked="data.status" @click="status_changer();">
        <span class="checkmark" ></span>
        <span class="chwhelper"></span>
  </label>
    `
})

var HTTP = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1/'
    });
var db_data_array = []; // for promise while get data from db
var nid = []; // for promise in new id set up
var ntitle = []; // for promise in new title set up

HTTP.get('/todolist/?format=json').then(function (response)  {
    response.data.forEach(async function (item, index, array) {
        await db_data_array.push(item);
    })
    return db_data_array; // here we get data from db
})

var vue = new Vue({
    el:'#app',
    data: {
        new_task: {
            title: ''
        }
        ,
        tasks: db_data_array
    },
        methods: {
            done_task(id) // visual data delete
            {
                this.tasks.splice(id, 1);
            },
            db_delete(dataid) // delete data from db
            {
                url = "/todolist/" + dataid;
                HTTP.delete(url);
            }
            ,
            bulk_deleter(){
                var urls_to_delete = [];
                var index_to_delete = [];
                var all_items = [];

                all_items = this.tasks
                this.tasks.forEach(async function (item, index, array){
                    if (item.status == true) {
                        url = "/todolist/" + item.id + "/";
                        urls_to_delete.push(url);
                        await index_to_delete.push(item.id);
                    }
                });

                urls_to_delete.forEach(function (item, index, array){
                    HTTP.delete(item)
                });
                index_to_delete.forEach(async function (item, index, array){
                    item_to_delete = all_items.indexOf(item)
                    await all_items.splice(item_to_delete, 1)
                });
                this.tasks = all_items;
                return this.tasks;
            }
            ,

            add_task() // add task visual and in db
            {
                nid = this.tasks
                ntitle.title = this.new_task.title
                if (ntitle.title != '') {
                        data = {
                            "title": ntitle.title,
                            "status": false
                                }
                HTTP.post('/todolist/', data).then(function (response)  {
                    nid.push({
                        id: response.data.id,
                        title: ntitle.title,
                        status: false,
                            })
                    return nid;
                                                                                })
                    this.tasks = nid
                    this.new_task.title = '';
                                    };
            }
            ,
            status_changer(id, status){
                this.tasks.forEach(async function (item, index, array) {
                    if (item.id == id){
                        item.status = await !item.status

                    }
                    return this.tasks;
                })

                const options = {
                    headers: {'Content-Type': 'application/json'}
                };
                data = {
                    "status": !status
                };
                url = "/todolist/" + id + "/";
                HTTP.patch(url, data, options.headers)
                return this.tasks;

            },
        }
});
