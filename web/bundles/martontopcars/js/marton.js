/**
 * Created by Marci on 27/10/14.
 */

function preload_images(array, el){

    var new_images = [], loaded_images = 0, arr_length = array.length, background_2, loading_container, progress_p;
    var container = (typeof el === "undefined" ? document.body : el);

    var post_action = function(){};

    var arr = (typeof array != "object") ? [array] : array;

    // Executes call-back function after preloading all images
    function image_load_post(){

        loaded_images++;
        progress_p.innerHTML = Math.round(100*(loaded_images/arr_length)) + "%";
        if (loaded_images == arr_length){
            on_finish();
            post_action(new_images);
        }
    }

    // Creates loading screen
    function on_create(){

        loading_container = document.createElement("div");
        loading_container.className  = "loading_container";

        progress_p = document.createElement("p");
        progress_p.className = "progress_p";
        loading_container.appendChild(progress_p);

        container.appendChild(loading_container);
    }

    // Removes loading screen
    function on_finish(){

        container.removeChild(loading_container);
    }

    on_create();

    for (var i=0; i<arr_length; i++){
        new_images[i] = new Image();
        new_images[i].src = arr[i];
        new_images[i].onload = function(){
            image_load_post();
        };
        new_images[i].onerror = function(){
            image_load_post();
        }
    }

    // Return blank object with done() method
    return {
        done:function(f){
            post_action= f || post_action;
        }
    }
}

function Game(){

    // Default settings
    var setting = {
        "players" : 4,
        "img_folder": "",
        "img_format":".png",
        "ajax_post_score":"",
        "game_container": document.getElementById("card_game")
    };

    this.setPlayers = function(number){
        setting.players = number;
        return this;
    };
    this.setImgFolder = function(path){
        setting.img_folder = path;
        return this;
    };
    this.setImgFormat = function(format){
        setting.img_format = format;
        return this;
    };
    this.setAjaxPostScore = function(path){
        setting.ajax_post_score = path;
        return this;
    };

    var anim_setting = {
        "fade_speed":150
    };

    // Stores progress details about the logged in user
    var user_info;
    this.setUserInfo = function(info){
        user_info = info;
    };

    // Whole deck of cards
    var cards = {};
    this.setCards = function (deck){
    };

    // Returns a random card from the deck
    function get_random_card(){
    }

    this.preload_images = function(callback){
    };

    var default_field =  {
        speed:{
            label:"Speed:",
            unit:"km/h",
            column_name:"speed"
        },
        power:{
            label:"Power:",
            unit:"hp",
            column_name:"power"
        },
        torque:{
            label:"Torque:",
            unit:"Nm",
            column_name:"torque"
        },
        acceleration:{
            label:"Acceleration:",
            unit:"s",
            column_name:"acceleration"
        },
        weight:{
            label:"Weight:",
            unit:"kg",
            column_name:"weight"
        }
    };

    var ui_container = {};
    var previous_active_rows;

    var top_panel;
    function get_top_panel(){
        return top_panel;
    }

    // Containing agents of the game
    var entity = {
        player:{
            host:null,
            opponent:[]
        }
    };

    // States of the game
    var isPaused        = false;
    var hasRoundEnded   = false;
    var isEnded         = true;

    // Actions made in the game
    function start(){
    }

    function restart(){
    }

    function next_round(){
    }

    function new_round(){
    }

    function select_field(){

    }

    function create_UI(){
    }

    function removeUI(){

    }

    // Module responsible for re-appearing buttons after each round.
    var roundControls = (function(){
    })();

    // Classes

    function Player(){

        // DOM Fields
        var view_field = {};
        this.setViewField = function(fields){
            view_field = fields;
        };

        // DOM Rows and Elements
        var view_holder = {};
        this.setViewHolder = function(views){
            view_holder = views;
        };
        this.getView = function(prop){
            return view_holder[prop];
        };

        // Values
        var card = {};
        this.setCard = function(new_card){
            card = new_card;

            for(key in card){
                if(card.hasOwnProperty(key) && key != "id" && key != "price"){
                    if (key !== "image"){
                        view_field[key].innerHTML = card[key];
                    }else{
                        view_field[key].src = setting.img_folder + card[key] + setting.img_format;
                    }
                }
            }

            return this;
        };
        this.getCard = function(property){
            return card[property];
        };

        this.roundScore  = 0;
        this.roundResult = 0;

        // Stores the player's score
        var score = 0;
        this.addScore = function(subscore){
            score = score + subscore;
        };
        this.getScore = function(){
            return score;
        };

        // Stores the player's streak
        var streak = 0;
        this.getStreak = function(){
            return streak;
        };
        this.addStreak = function(substreak){
            streak += substreak;
        };
        this.resetStreak = function(){
            streak = 0;
        };

        this.showCard = function(callback){
            if (typeof callback === 'undefined') callback = function(){};
            $(view_holder.card).fadeIn(anim_setting.fade_speed, callback);
            return this;
        };

        this.hideCard = function(callback){
            if (typeof callback === 'undefined') callback = function(){};
            $(view_holder.card).fadeOut(anim_setting.fade_speed, callback);
            return this;
        }
    }

    function TopPanel(){

        var container;
        this.setContainer = function(c){
            container = c;
        };

        var attribute = {
            score: 0,
            low_score_limit: 0,
            high_score_limit: 0
        };

        var ui = {};

        this.create_UI = function(){

            container.top_panel = document.getElementById("top_panel");

            var fill = document.getElementById("s_fill");
            ui.fill = fill;

            // Text middle
            var level_score = document.getElementById("s_score");
            ui.score = level_score;
        };

        this.update = function(level_change, user_level_info){
            // user_level_info is an object with attributes: "low_score_limit", "high_score_limit", "level", "score"

            var previous_score = attribute.score;

            switch (level_change){
                case "up":

                    // Animation till the top
                    animate_increment(previous_score, attribute.high_score_limit, ui.score);
                    animate_fill(previous_score, attribute.high_score_limit, function(){

                        // TODO: level up graphics
                        set_attributes(user_level_info);

                        set_UI();

                        // Animation till new score
                        animate_increment(attribute.low_score_limit, attribute.score, ui.score);
                        animate_fill(attribute.low_score_limit, attribute.score);

                    });

                    break;

                case "down":

                    // Animation till the bottom
                    animate_increment(previous_score, attribute.low_score_limit, ui.score);
                    animate_fill(previous_score, attribute.low_score_limit, function(){

                        // TODO: level up graphics
                        set_attributes(user_level_info);

                        set_UI();

                        // Animation till new score
                        animate_increment(attribute.high_score_limit, attribute.score, ui.score);
                        animate_fill(attribute.high_score_limit, attribute.score);

                    });

                    break;

                default:

                    set_attributes(user_level_info);

                    set_UI();

                    animate_increment(previous_score, attribute.score, ui.score);
                    animate_fill(previous_score, attribute.score);

                    break;
            }


            return this;

            function set_attributes(user_level_info){

                attribute.low_score_limit   = user_level_info.low_score_limit;
                attribute.score             = user_level_info.score;
                attribute.high_score_limit  = user_level_info.high_score_limit;
            }

            function set_UI(){

                //ui.low_score_limit.innerHTML = attribute.score - attribute.low_score_limit;
                //ui.high_score_limit.innerHTML = attribute.high_score_limit - attribute.score + " until next level";
            }

            function animate_fill (old_score, new_score, callback){

                callback = typeof callback !== 'undefined' ? callback : function(){};

                var old_width = Math.round(100*(old_score-attribute.low_score_limit)/(attribute.high_score_limit - attribute.low_score_limit));
                $(ui.fill).css({"width":old_width+"%"});

                var new_width = Math.round(100*(new_score-attribute.low_score_limit)/(attribute.high_score_limit - attribute.low_score_limit));
                if (new_width>100) new_width = 100;

                $(ui.fill).promise().done(function(){
                    // 200  - 400 ms
                    $(this).animate({"width":new_width+"%"}, 200, callback);
                });
            }

            // Helper function to show a value increment/decrement
            function animate_increment (old_score, new_score, el){

                var PRINT_AMOUNT = 8;

                var step = Math.ceil(Math.abs(old_score-new_score)/8);

                if (old_score < new_score){
                    var compare = function(s1,s2){
                        return s1 + step >= s2;
                    };
                    var modify = function (){
                        old_score += step;
                    };
                }else{
                    var compare = function(s1,s2){
                        return s1 - step <= s2;
                    };
                    var modify = function (){
                        old_score -= step;
                    };
                }

                var interval = setInterval(function() {
                    el.innerHTML = old_score;
                    if (compare(old_score, new_score)){
                        clearInterval(interval);
                        el.innerHTML = new_score;
                    }
                    modify();
                }, Math.round(200/PRINT_AMOUNT));
            }
        }
    }

    function Card(){

        this.create = function(){

            var field_holder = {};
            var view_holder = {};

            var card_fragment = document.createElement("div");
            card_fragment.className = "card_fragment";

            // Card
            var card_block = document.createElement("div");
            card_block.className = "card_block";
            card_fragment.appendChild(card_block);

            var player_card = document.createElement("div");
            player_card.className = "player_card";
            card_block.appendChild(player_card);
            view_holder.card = player_card;

            // Card Name
            var card_name = document.createElement("div");
            card_name.className = "card_name";
            player_card.appendChild(card_name);

            field_holder.model = card_name;
            view_holder.model = card_name;

            // Card Image
            var card_image = document.createElement("div");
            card_image.className = "card_image";
            player_card.appendChild(card_image);

            var img = document.createElement("img");
            card_image.appendChild(img);

            field_holder.image = img;
            view_holder.image = card_image;


            // Rest
            var card_row, row_label, t;

            for(key in default_field){
                if(default_field.hasOwnProperty(key)){
                    card_row = document.createElement("div");
                    card_row.className = "card_row";
                    card_row.setAttribute("name",key);
                    card_row.addEventListener("click",select_field);
                    player_card.appendChild(card_row);
                    view_holder[key] = card_row;

                    row_label = document.createElement("span");
                    row_label.className = "row_label";
                    card_row.appendChild(row_label);

                    t = document.createTextNode(default_field[key].label);
                    row_label.appendChild(t);

                    // Changing field
                    row_label = document.createElement("span");
                    card_row.appendChild(row_label);
                    field_holder[key] = row_label;

                    row_label = document.createElement("span");
                    row_label.className = "row_unit";
                    card_row.appendChild(row_label);

                    t = document.createTextNode(default_field[key].unit);
                    row_label.appendChild(t);
                }
            }

            return {
                field_holder: field_holder,
                view_holder: view_holder,
                card_fragment: card_fragment
            };
        };
    }

    function Battlefield(){

        this.create = function(){

            var battlefield = document.getElementById("battlefield");
            return battlefield;
        }
    }

}