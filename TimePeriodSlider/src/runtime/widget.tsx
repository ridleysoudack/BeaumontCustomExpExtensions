/** @jsx jsx */
import { React, AllWidgetProps, jsx, DataSourceComponent, SqlQueryParams, DataSourceManager, QueriableDataSource, DataSource } from 'jimu-core';
import defaultMessages from './translations/default';
import { Slider } from 'jimu-ui';

//Set state elements required
interface State {
  growthStage: GrowthStage;
  timePeriod: TimePeriod;
}

//Array holding values for query
enum GrowthStage{
  present = "present",
  fiveYears = "five_years",
  tenYears = "ten_years",
  fifteenYears = "fifteen_years"
}

//Array holding text values for dynamic text
enum TimePeriod {
  present = "Present Day",
  fiveYears = "Five Years Time",
  tenYears = "Ten Years Time",
  fifteenYears= "Fifteen Years Time"
}

export default class Widget extends React.PureComponent<AllWidgetProps<unknown>, State> {
  constructor (props) {
    super(props)

    this.state = { //Set default state
      growthStage: GrowthStage.present,
      timePeriod: TimePeriod.present,
    }
  }

//Get query parameters
  getQuery = (growthStage: GrowthStage): SqlQueryParams => {
    return {
      where: this.getFilter(growthStage)
    }
  }

  getFilter = (growthStage: GrowthStage): string => {
    if (growthStage) {
      return `(growth_stage = '${growthStage}')`
    }
  }

  //On slider change, update dynamic text label and query for all layers
  onSliderChange = (evt) => {
    const growthStage = Object.values(GrowthStage)[evt.target.value]
    const timePeriod = Object.values(TimePeriod)[evt.target.value]
    this.setState({ growthStage})
    this.setState({timePeriod})
    //This iterates over each data source supplied and run the query on each.
    this.props.useDataSources?.forEach( (element) => {
      const dataSourceId = element.dataSourceId
      const dataSource = dataSourceId && DataSourceManager.getInstance().getDataSource(dataSourceId) as QueriableDataSource
      if (dataSource) {
        //Update query in each data source
        dataSource.updateQueryParams(this.getQuery(growthStage), this.props.id)
      }
    });

  }

  onDataSourceCreated = (ds: DataSource) => {
    //On creation of third datasource, set each data source to "Present" query. This is a workaround to ensure all data sources loaded before initial query.
    if (this.state.growthStage && ds) {
      this.props.useDataSources?.forEach( (element) => {
        const dataSourceId = element.dataSourceId
        const dataSource = dataSourceId && DataSourceManager.getInstance().getDataSource(dataSourceId) as QueriableDataSource
        if (dataSource) {
          //Update query in data source
          dataSource.updateQueryParams(this.getQuery(GrowthStage.present), this.props.id)
        }
      });
    }
  }
  render () {
    return (
      <div className="widget-demo jimu-widget m-2">
        <DataSourceComponent
          useDataSource={this.props.useDataSources?.[3]}
          widgetId={this.props.id}
          onDataSourceCreated={this.onDataSourceCreated}
          />
      <p className="shadow-lg m-3 p-3 bg-white rounded">
      <b>{this.props.intl.formatMessage({id:'sliderTitle', defaultMessage: defaultMessages['sliderTitle']})}</b>
      <span>{this.state.timePeriod}</span>
       <br/>
          <Slider
            aria-label="Range"
            defaultValue={0}
            max={3}
            min={0}
            onChange={(evt) => {
              this.onSliderChange(evt);
            }}
            step={1}
            style={{ maxWidth: "100%" }}
          />
        </p>
      </div>
    )
  }
}
