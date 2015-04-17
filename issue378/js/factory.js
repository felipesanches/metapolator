app.factory("sharedScope", function($rootScope) {
    var scope = $rootScope.$new(true);
    scope.data = {
        projectName : "Rozha",
        sequences : [{
            id : 0,
            name : "Sequence 1",
            masters : []
        }],
        adjustmentMasters : [],
        designSpaces : [{
            trigger : 0,
            name : "Space 0",
            id : 0,
            type : "x",
            masters : [],
            axes : [],
            triangle : false,
            mainMaster : 1

        }],
        families : [{
            id : 0,
            instances : []
        }],
        currentDesignSpace : null,
        eventHandlers : {
            mousedown : false,
            initialDisplay : null
        },
        localmenu : {
            project : false,
            help : false,
            masters : false,
            instances : false,
            designspace: false,
            fonts: false
        },
        parametersPanel : 0,
        viewState: 0
    };
    return scope;
});
