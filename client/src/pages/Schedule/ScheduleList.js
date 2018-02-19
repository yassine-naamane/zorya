import React from 'react';

// Recompose
import { compose } from 'recompose';

// Router
import {
  withRouter,
} from 'react-router-dom';


// Material UI
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow, TableSortLabel } from 'material-ui/Table';
import Tooltip from 'material-ui/Tooltip';
import Button from 'material-ui/Button';

import AddIcon from 'material-ui-icons/Add';
import RefreshIcon from 'material-ui-icons/Refresh';
import DeleteIcon from 'material-ui-icons/Delete';

// Lodash
import map from 'lodash/map';

// Project
import ScheduleService from '../../modules/api/schedule';
import AppPageContent from '../../modules/components/AppPageContent';
import AppPageActions from '../../modules/components/AppPageActions';

const styles = theme => ({
  root: {
    height: '100%',
  },
  button: {
    marginRight: theme.spacing.unit * 2,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

class ScheduleList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      schedules: [],
      order: 'asc'
    }

    this.scheduleService = new ScheduleService();
  }

  componentDidMount() {
    this.refreshList();
  }

  handleRequestSort = event => {
    this.setState((prevState, props) => {
      let order = 'desc'
      if (prevState.order === 'desc') {
        order = 'asc';
      }

      const schedules =
        order === 'desc'
          ? prevState.schedules.sort((a, b) => b < a ? -1 : 1)
          : prevState.schedules.sort((a, b) => a < b ? -1 : 1);

      return {
        schedules,
        order
      }
    });
  }

  handleClickNavigate = path => event => {
    const { history } = this.props;
    history.push(path);
  }

  handleClickRefresh = event => {
    this.refreshList();
  }

  refreshList = async () => {
    const schedules = await this.scheduleService.list();
    this.setState({
      schedules
    });
  }


  render() {
    const { classes } = this.props;
    const { schedules, order } = this.state;

    return (
      <div className={classes.root}>
        <AppPageActions>
          <Button className={classes.button} color="primary" size="small" onClick={this.handleClickNavigate(`/schedules/create`)}>
            <AddIcon className={classes.leftIcon} />
            Create Schedule
          </Button>
          <Button className={classes.button} color="primary" size="small" onClick={this.handleClickRefresh}>
            <RefreshIcon className={classes.leftIcon} />
            Refresh
          </Button>
          <Button className={classes.button} color="primary" size="small" disabled>
            <DeleteIcon className={classes.leftIcon} />
            Delete
          </Button>
        </AppPageActions>

        <AppPageContent>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell sortDirection={order}>
                  <Tooltip
                    title={order === 'desc' ? 'descending' : 'ascending'}
                    placement="bottom-start"
                    enterDelay={500}
                  >
                    <TableSortLabel
                      active
                      direction={order}
                      onClick={this.handleRequestSort}
                    >
                      Schedules
                  </TableSortLabel>
                  </Tooltip></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {map(schedules, schedule =>
                <TableRow key={schedule} hover >
                  <TableCell onClick={this.handleClickNavigate(`/schedules/browser/${schedule}`)}>
                    {schedule}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </AppPageContent>
      </div>
    )
  }
}

export default compose(
  withRouter,
  withStyles(styles),
)(ScheduleList);
