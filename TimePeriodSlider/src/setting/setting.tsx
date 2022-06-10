import defaultMessages from './translations/default';
import { React, jsx, DataSourceTypes, Immutable, UseDataSource } from 'jimu-core'
import { AllWidgetSettingProps } from 'jimu-for-builder';
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector';
import { IMConfig } from '../config';

export default class Setting extends React.PureComponent<AllWidgetSettingProps<unknown>, unknown> {

  supportedTypes = Immutable([DataSourceTypes.FeatureLayer])

  onDataSourceChange = (useDataSources: UseDataSource[]) => {
    this.props.onSettingChange({
      id: this.props.id,
      useDataSources: useDataSources
    })
  }

  render() {
    return (
    <div className="widget-setting p-3">
      <DataSourceSelector
        mustUseDataSource
        types = {this.supportedTypes}
        useDataSources={this.props.useDataSources}
        onChange={this.onDataSourceChange}
        widgetId={this.props.id}
        isMultiple
        />
    </div>
    )
  }  
}