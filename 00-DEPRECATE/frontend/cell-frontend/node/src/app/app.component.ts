import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Config } from "./config/config";
import * as pixi from "pixi.js";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [  ],
  viewProviders: [  ]
})
export class AppComponent implements OnInit {

    /*

        Constructor

    */

    /*
    
        Private members

    */

    private _a: string = "I'm a";
    private _v: string;
    private _config_a: string;
    @ViewChild("pixi") el: ElementRef;

    public ngOnInit() {

        // Read environment variable

        console.log(`Running ${Config.version}...`);

        this._v = Config.version;

        this._config_a = Config.config_a;

        const renderer = pixi.autoDetectRenderer(512, 512);

        this.el.nativeElement.appendChild(renderer.view);

        const stage = new pixi.Container();

        let graph: pixi.Graphics = new pixi.Graphics();

        stage.addChild(graph);

        graph.position.set(50, 10);

        graph.lineStyle(2, 0xffffff)
            .moveTo(0, 0)
            .lineTo(100, 100);

        renderer.render(stage);

        console.log("pixi", renderer instanceof pixi.WebGLRenderer);

    }

    /*

        Private methods

    */

    /*

        Lifecycle methods

    */


}
