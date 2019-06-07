import React from 'react';
import { fetchMock } from 'fetch-mock';
import { Provider } from 'react-redux';
import { render, cleanup, waitForElement } from '@testing-library/react/typings';

import { getProjectUrl } from '../../../../../ui/helpers/location';
import { PushesClass } from '../../../../../ui/job-view/context/Pushes';
import FilterModel from '../../../../../ui/models/filter';
import pushListFixture from '../../../mock/push_list';
import jobListFixtureOne from '../../../mock/job_list/job_1';
import jobListFixtureTwo from '../../../mock/job_list/job_2';
import { store } from '../../../../../ui/job-view/redux/store';
import PushList from '../../../../../ui/job-view/pushes/PushList';
import { PinnedJobs } from '../../../../../ui/job-view/context/PinnedJobs';
import reducer from '../../../../../ui/job-view/redux/stores/pushes';

afterEach(cleanup);

describe('Pushes Redux store', () => {
  const repoName = 'autoland';
  beforeAll(() => {
    fetchMock.get(
      getProjectUrl('/push/?full=true&count=10', repoName),
      pushListFixture,
    );
    fetchMock.get(
      getProjectUrl('/jobs/?push_id=1&count=2000&return_type=list', repoName),
      jobListFixtureOne,
    );

    fetchMock.mock(
      getProjectUrl('/jobs/?push_id=2&count=2000&return_type=list', repoName),
      jobListFixtureTwo,
    );
  });

  afterAll(() => {
    fetchMock.reset();
  });


  test('should have id of 1 in current repo', async () => {
    const pushes = mount(
      <PushesClass filterModel={new FilterModel()} notify={() => {}}>
        <div />
      </PushesClass>,
    );
    await pushes.instance().fetchPushes(10);
    expect(pushes.state('pushList')[0].id).toBe(1);
  });

  // test('should add new push when polling', async () => {
  //   // impl
  // });
  //
  // test('should add new jobs when polling', async () => {
  //   // impl
  // });
  //
  // test('should be able to select a job', async () => {
  //   // impl
  // });
  //
  // test('should not reload when clicking a loaded revision', async () => {
  //   // impl
  // });
  //
  // test('should reload pushes when changing revision to null in url', async () => {
  //   // impl
  // });
  //
  // test('should reload pushes when setting fromchange', async () => {
  //   // impl
  // });
  //
  // test('should reload pushes when setting fromchange in url', async () => {
  //   // impl
  // });
  //
  // test('should reload pushes when setting tochange', async () => {
  //   // impl
  // });
  //
  // test('should reload pushes when setting startdate', async () => {
  //   // impl
  // });
  //
  // test('should reload pushes when setting author', async () => {
  //   // impl
  // });
  //
  // test('switching repo should put new repo on the left on SecondaryNavBar', async () => {
  //   // impl
  // });
  //
  // test('switching repo should update count of unclassified', async () => {
  //   // impl
  // });
});

describe('pushes store', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([
      {
        text: 'Use Redux',
        completed: false,
        id: 0,
      },
    ]);
  });

  test('should handle ADD_TODO', () => {
    expect(
      reducer([], {
        type: types.ADD_TODO,
        text: 'Run the tests',
      }),
    ).toEqual([
      {
        text: 'Run the tests',
        completed: false,
        id: 0,
      },
    ]);

    expect(
      reducer(
        [
          {
            text: 'Use Redux',
            completed: false,
            id: 0,
          },
        ],
        {
          type: types.ADD_TODO,
          text: 'Run the tests',
        },
      ),
    ).toEqual([
      {
        text: 'Run the tests',
        completed: false,
        id: 1,
      },
      {
        text: 'Use Redux',
        completed: false,
        id: 0,
      },
    ]);
  });
});
