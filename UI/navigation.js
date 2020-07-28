import GLOBALS from "../config.js"

export default class Navigation {

    constructor() {  

        this.curr_page = 1;
        this.num_pages = 6;

        document.getElementById("next").onclick = this.next_page.bind(this);
        document.getElementById("back").onclick = this.prev_page.bind(this);

    }

    next_page() {

        if (this.curr_page < this.num_pages) {
            this.curr_page++
            // page_operations(curr_page)
            document.getElementById("Page" + String(this.curr_page)).style.display = 'flex';
            document.getElementById("Page" + String(this.curr_page - 1)).style.display = 'none';
        }
        if (this.curr_page != 1) document.getElementById("back").style.display = 'inline';
        if (this.curr_page == this.num_pages) document.getElementById("next").style.display = 'none';

        this.update_page(this.curr_page);

    }

    prev_page() {


        if (this.curr_page > 1) {
            this.curr_page--;
            // page_operations(curr_page)
            document.getElementById("Page" + String(this.curr_page)).style.display = 'flex';
            document.getElementById("Page" + String(this.curr_page + 1)).style.display = 'none';
        }

        if (this.curr_page == 1) document.getElementById("back").style.display = 'none';
        if (this.curr_page != this.num_pages) document.getElementById("next").style.display = 'inline';

        this.update_page(this.curr_page);
    }

    update_page(page_num) {
        switch (page_num) {
            case 3:
                // console.log(countLayer);
                if (document.getElementById('layer-final') == null) {
                    addLayer(countLayer + 1, "final", disabled = true)
                }
                break;
            // case 4:
            //     lossOptions();
            //     break;
        }

    }




}