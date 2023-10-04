/*
 * Copyright (C) 2022 con terra GmbH (info@conterra.de)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import Binding from "apprt-binding/Binding";
import Vue from "apprt-vue/Vue";
import VueDijit from "apprt-vue/VueDijit";
import BasemapChangerWidget from "./BasemapChangerWidget.vue";

export default class BasemapChangerWidgetFactory {

    #vm = undefined;
    #binding = undefined;
    #mapWidgetModelBinding = undefined;

    activate() {
        this._initComponent();
    }

    deactivate() {
        this.#binding.unbind();
        this.#binding = undefined;
        this.#mapWidgetModelBinding.unbind();
        this.#mapWidgetModelBinding = undefined;
        this.#vm = undefined;
    }

    createInstance() {
        return VueDijit(this.#vm, {class: "basemapchanger-widget"});
    }

    _initComponent() {
        const basemapsModel = this._basemapsModel;
        const basemaps = basemapsModel.basemaps.map((basemap) => {
            return {
                id: basemap.id,
                title: basemap.title,
                thumbnailUrl: basemap.thumbnailUrl
            };
        });

        const properties = this._properties;
        basemapsModel.selectedId = properties.selectedBasemapId;

        const vm = this.#vm = new Vue(BasemapChangerWidget);
        vm.basemaps = basemaps;

        this.#binding = Binding.for(vm, basemapsModel)
            .syncAll("selectedId")
            .enable()
            .syncToLeftNow();

        const mapWidgetModel = this._mapWidgetModel;
        this.#mapWidgetModelBinding = Binding.for(vm, mapWidgetModel)
            .syncAll("zoom")
            .enable()
            .syncToLeftNow();
    }

}
