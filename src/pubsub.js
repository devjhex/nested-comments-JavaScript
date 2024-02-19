
export const pubSub = {
    events:{},
    subscribe:function(eventName, fn){
       this.events[eventName] = this.events[eventName] || [];
       this.events[eventName].push(fn);
    },
    unsubscribe:function(eventName, fn){
        if(this.events[eventName]){
            this.events[eventName] = this.events[eventName].filter(func =>{
                return func !== fn;
            })
        }
    },
    publish(eventName, data){
        if(this.events[eventName]){
            this.events[eventName].forEach(func => {
                func(data);                
            });
        }
    }
};