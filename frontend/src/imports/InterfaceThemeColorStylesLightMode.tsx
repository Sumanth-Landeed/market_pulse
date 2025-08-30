function Title() {
  return (
    <div className="content-stretch flex flex-col gap-4 items-start justify-start leading-[0] not-italic relative shrink-0 text-[#050406] w-full" data-name="Title">
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center relative shrink-0 text-[0px] w-full">
        <p className="leading-[40px] text-[36px]">
          <span>{`Color Styles `}</span>
          <span className="font-['Inter:Regular',_sans-serif] font-normal not-italic text-[#050406]">(Light Mode)</span>
        </p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center relative shrink-0 text-[30px] w-full">
        <p className="leading-[36px]">Color themes are designed to be harmonious, ensure accessible text, and distinguish UI elements and surfaces from one another. The following set of colors are used across the entire ecosystem of products.</p>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-[#7134da] h-[100px] relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 h-[100px] items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white">
            <p className="leading-[24px] whitespace-pre">primary/default</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-white relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#7134da] text-[16px] text-nowrap">
            <p className="leading-[24px] whitespace-pre">primary/on</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Primary() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-[302px]" data-name="Primary">
      <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative w-[302px]">
        <Frame3 />
        <Frame4 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#a175ff] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-[#f5ebff] h-[100px] relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 h-[100px] items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#3e008f] text-[16px] text-nowrap">
            <p className="leading-[24px] whitespace-pre">primary/container</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-[#3e008f] relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#f5ebff] text-[16px] text-nowrap">
            <p className="leading-[24px] whitespace-pre">primary/on-container</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrimaryContainer() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-[302px]" data-name="Primary container">
      <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative w-[302px]">
        <Frame5 />
        <Frame6 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#a175ff] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame7() {
  return (
    <div className="bg-[#fef5ff] h-[100px] relative rounded-[8px] shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 h-[100px] items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#3e008f] text-[16px] text-nowrap">
            <p className="leading-[24px] whitespace-pre">primary/accent</p>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#a175ff] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function PrimaryContainer1() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start relative rounded-[8px] shrink-0 w-[302px]" data-name="Primary container">
      <Frame7 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="bg-[#d3bdff] h-[100px] relative rounded-[8px] shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 h-[100px] items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white">
            <p className="leading-[24px] whitespace-pre">primary/strong</p>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#a175ff] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function PrimaryContainer2() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start relative rounded-[8px] shrink-0 w-[302px]" data-name="Primary container">
      <Frame8 />
    </div>
  );
}

function Frame60161() {
  return (
    <div className="content-stretch flex gap-8 items-start justify-start overflow-clip relative shrink-0">
      <Primary />
      <PrimaryContainer />
      <PrimaryContainer1 />
      <PrimaryContainer2 />
    </div>
  );
}

function Primary1() {
  return (
    <div className="content-stretch flex flex-col gap-[60px] items-start justify-start relative shrink-0 w-full" data-name="Primary">
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#050406] text-[30px]" style={{ width: "min-content" }}>
        <p className="leading-[36px]">Primary</p>
      </div>
      <Frame60161 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="bg-[#006c4c] h-[100px] relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 h-[100px] items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white">
            <p className="leading-[24px] whitespace-pre">success/default</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="bg-white relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#006c4c] text-[16px] text-nowrap">
            <p className="leading-[24px] whitespace-pre">success/on</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Primary2() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-[302px]" data-name="Primary">
      <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative w-[302px]">
        <Frame9 />
        <Frame16 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#00a575] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame17() {
  return (
    <div className="bg-[#bdffdd] h-[100px] relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 h-[100px] items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#003826] text-[16px] text-nowrap">
            <p className="leading-[24px] whitespace-pre">success/container</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame18() {
  return (
    <div className="bg-[#003826] relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#bdffdd] text-[16px] text-nowrap">
            <p className="leading-[24px] whitespace-pre">success/on-container</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrimaryContainer3() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-[302px]" data-name="Primary container">
      <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative w-[302px]">
        <Frame17 />
        <Frame18 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#00a575] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame19() {
  return (
    <div className="bg-[#25c28d] h-[100px] relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-3 h-[100px] items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white">
            <p className="leading-[24px] whitespace-pre">success/strong</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrimaryContainer4() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative rounded-[8px] shrink-0 w-[302px]" data-name="Primary container">
      <Frame19 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="bg-[#e8fff0] h-[100px] relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-3 h-[100px] items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#003826] text-[16px] text-nowrap">
            <p className="leading-[24px] whitespace-pre">success/accent</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrimaryContainer5() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-[302px]" data-name="Primary container">
      <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative w-[302px]">
        <Frame20 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#00a575] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Success() {
  return (
    <div className="content-stretch flex flex-col gap-8 items-start justify-start overflow-clip relative shrink-0" data-name="Success">
      <Primary2 />
      <PrimaryContainer3 />
      <PrimaryContainer4 />
      <PrimaryContainer5 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="bg-[#6a5f00] h-[100px] relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 h-[100px] items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white">
            <p className="leading-[24px] whitespace-pre">warning/default</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame22() {
  return (
    <div className="bg-white relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#6a5f00] text-[16px] text-nowrap">
            <p className="leading-[24px] whitespace-pre">warning/on</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Primary3() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-[302px]" data-name="Primary">
      <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative w-[302px]">
        <Frame21 />
        <Frame22 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#a39100] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame23() {
  return (
    <div className="bg-[#fff2ab] h-[100px] relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 h-[100px] items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#373100] text-[16px] text-nowrap">
            <p className="leading-[24px] whitespace-pre">warning/container</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame24() {
  return (
    <div className="bg-[#373100] relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#fff2ab] text-[16px] text-nowrap">
            <p className="leading-[24px] whitespace-pre">warning/on-container</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrimaryContainer6() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-[302px]" data-name="Primary container">
      <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative w-[302px]">
        <Frame23 />
        <Frame24 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#a39100] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame25() {
  return (
    <div className="bg-[#c0ac00] h-[100px] relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-3 h-[100px] items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white">
            <p className="leading-[24px] whitespace-pre">warning/strong</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrimaryContainer7() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative rounded-[8px] shrink-0 w-[302px]" data-name="Primary container">
      <Frame25 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="bg-[#fff9ea] h-[100px] relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-3 h-[100px] items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#373100] text-[16px] text-nowrap">
            <p className="leading-[24px] whitespace-pre">warning/accent</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrimaryContainer8() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-[302px]" data-name="Primary container">
      <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative w-[302px]">
        <Frame26 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#a39100] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Warning() {
  return (
    <div className="content-stretch flex flex-col gap-8 items-start justify-start overflow-clip relative shrink-0" data-name="Warning">
      <Primary3 />
      <PrimaryContainer6 />
      <PrimaryContainer7 />
      <PrimaryContainer8 />
    </div>
  );
}

function Frame27() {
  return (
    <div className="bg-[#bb1b1b] h-[100px] relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 h-[100px] items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white">
            <p className="leading-[24px] whitespace-pre">danger/default</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame28() {
  return (
    <div className="bg-white relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#bb1b1b] text-[16px] text-nowrap">
            <p className="leading-[24px] whitespace-pre">danger/on</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Primary4() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-[302px]" data-name="Primary">
      <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative w-[302px]">
        <Frame27 />
        <Frame28 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#ff5447] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame29() {
  return (
    <div className="bg-[#ffeeeb] h-[100px] relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 h-[100px] items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#6b0005] text-[16px] text-nowrap">
            <p className="leading-[24px] whitespace-pre">danger/container</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame30() {
  return (
    <div className="bg-[#6b0005] relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#ffeeeb] text-[16px] text-nowrap">
            <p className="leading-[24px] whitespace-pre">danger/on-container</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrimaryContainer9() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-[302px]" data-name="Primary container">
      <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative w-[302px]">
        <Frame29 />
        <Frame30 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#ff5447] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame31() {
  return (
    <div className="bg-[#ff5447] h-[100px] relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-3 h-[100px] items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white">
            <p className="leading-[24px] whitespace-pre">danger/strong</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrimaryContainer10() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative rounded-[8px] shrink-0 w-[302px]" data-name="Primary container">
      <Frame31 />
    </div>
  );
}

function Frame32() {
  return (
    <div className="bg-[#fff6f5] h-[100px] relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-3 h-[100px] items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#6b0005] text-[16px] text-nowrap">
            <p className="leading-[24px] whitespace-pre">danger/accent</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrimaryContainer11() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-[302px]" data-name="Primary container">
      <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative w-[302px]">
        <Frame32 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#ff5447] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Danger() {
  return (
    <div className="content-stretch flex flex-col gap-8 items-start justify-start overflow-clip relative shrink-0" data-name="Danger">
      <Primary4 />
      <PrimaryContainer9 />
      <PrimaryContainer10 />
      <PrimaryContainer11 />
    </div>
  );
}

function Frame33() {
  return (
    <div className="bg-[#005ac7] h-[100px] relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 h-[100px] items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white">
            <p className="leading-[24px] whitespace-pre">info/default</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame34() {
  return (
    <div className="bg-white relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#005ac7] text-[16px] text-nowrap">
            <p className="leading-[24px] whitespace-pre">info/on</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Primary5() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-[302px]" data-name="Primary">
      <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative w-[302px]">
        <Frame33 />
        <Frame34 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#528bff] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame35() {
  return (
    <div className="bg-[#ebeeff] h-[100px] relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 h-[100px] items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#002d6b] text-[16px] text-nowrap">
            <p className="leading-[24px] whitespace-pre">info/container</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame36() {
  return (
    <div className="bg-[#002d6b] relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#ebeeff] text-[16px] text-nowrap">
            <p className="leading-[24px] whitespace-pre">info/on-container</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrimaryContainer12() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-[302px]" data-name="Primary container">
      <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative w-[302px]">
        <Frame35 />
        <Frame36 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#528bff] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame37() {
  return (
    <div className="bg-[#528bff] h-[100px] relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-3 h-[100px] items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white">
            <p className="leading-[24px] whitespace-pre">info/strong</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrimaryContainer13() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative rounded-[8px] shrink-0 w-[302px]" data-name="Primary container">
      <Frame37 />
    </div>
  );
}

function Frame38() {
  return (
    <div className="bg-[#fbfaff] h-[100px] relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-3 h-[100px] items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#002d6b] text-[16px] text-nowrap">
            <p className="leading-[24px] whitespace-pre">info/accent</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrimaryContainer14() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-[302px]" data-name="Primary container">
      <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative w-[302px]">
        <Frame38 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#528bff] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Info() {
  return (
    <div className="content-stretch flex flex-col gap-8 items-start justify-start overflow-clip relative shrink-0" data-name="Info">
      <Primary5 />
      <PrimaryContainer12 />
      <PrimaryContainer13 />
      <PrimaryContainer14 />
    </div>
  );
}

function Frame39() {
  return (
    <div className="bg-[#5f5c60] h-[100px] relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 h-[100px] items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white">
            <p className="leading-[24px] whitespace-pre">neutral/default</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame40() {
  return (
    <div className="bg-white relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#5f5c60] text-[16px] text-nowrap">
            <p className="leading-[24px] whitespace-pre">neutral/on</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Primary6() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-[302px]" data-name="Primary">
      <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative w-[302px]">
        <Frame39 />
        <Frame40 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#ada9ad] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame41() {
  return (
    <div className="bg-[#f5eff4] h-[100px] relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 h-[100px] items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#262428] text-[16px] text-nowrap">
            <p className="leading-[24px] whitespace-pre">neutral/container</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame42() {
  return (
    <div className="bg-[#262428] relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#f5eff4] text-[16px] text-nowrap">
            <p className="leading-[24px] whitespace-pre">neutral/on-container</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrimaryContainer15() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-[302px]" data-name="Primary container">
      <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative w-[302px]">
        <Frame41 />
        <Frame42 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#ada9ad] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame43() {
  return (
    <div className="bg-[#fdf7fd] h-[100px] relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-3 h-[100px] items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#262428] text-[16px] text-nowrap">
            <p className="leading-[24px] whitespace-pre">neutral/accent</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrimaryContainer16() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-[302px]" data-name="Primary container">
      <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative w-[302px]">
        <Frame43 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#ada9ad] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Info1() {
  return (
    <div className="content-stretch flex flex-col gap-8 items-start justify-start overflow-clip relative shrink-0" data-name="Info">
      <Primary6 />
      <PrimaryContainer15 />
      <PrimaryContainer16 />
    </div>
  );
}

function Frame60163() {
  return (
    <div className="content-stretch flex gap-8 items-start justify-start overflow-clip relative shrink-0">
      <Success />
      <Warning />
      <Danger />
      <Info />
      <Info1 />
    </div>
  );
}

function Feedback() {
  return (
    <div className="content-stretch flex flex-col gap-[60px] items-start justify-start relative shrink-0 w-full" data-name="Feedback">
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#050406] text-[30px]" style={{ width: "min-content" }}>
        <p className="leading-[36px]">Feedback</p>
      </div>
      <Frame60163 />
    </div>
  );
}

function Frame44() {
  return (
    <div className="bg-[#262428] h-[100px] relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 h-[100px] items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#fdf7fd] text-[16px] text-nowrap">
            <p className="leading-[24px] whitespace-pre">bg/inverse/base</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame45() {
  return (
    <div className="bg-[#fdf7fd] relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#262428] text-[16px] text-nowrap">
            <p className="leading-[24px] whitespace-pre">bg/inverse/on</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Primary7() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-[302px]" data-name="Primary">
      <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative w-[302px]">
        <Frame44 />
        <Frame45 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d9d4d9] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame46() {
  return (
    <div className="bg-white h-[100px] relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 h-[100px] items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#050406] text-[16px] text-nowrap">
            <p className="leading-[24px] whitespace-pre">bg/default</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Primary8() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-[302px]" data-name="Primary">
      <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative w-[302px]">
        <Frame46 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e0e5] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame47() {
  return (
    <div className="bg-[#fdf7fd] h-[100px] relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 h-[100px] items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#050406] text-[16px] text-nowrap">
            <p className="leading-[24px] whitespace-pre">bg/container/base</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Primary9() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-[302px]" data-name="Primary">
      <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative w-[302px]">
        <Frame47 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e0e5] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame48() {
  return (
    <div className="bg-[#f5eff4] h-[100px] relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 h-[100px] items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#050406] text-[16px] text-nowrap">
            <p className="leading-[24px] whitespace-pre">bg/container/high</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Primary10() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-[302px]" data-name="Primary">
      <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative w-[302px]">
        <Frame48 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d9d4d9] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame49() {
  return (
    <div className="bg-[#e5e0e5] h-[100px] relative shrink-0 w-full">
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-3 h-[100px] items-start justify-start p-[12px] relative w-full">
          <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#bdb7bd] text-[16px] text-nowrap">
            <p className="leading-[24px] whitespace-pre">bg/disabled</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Primary11() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-[302px]" data-name="Primary">
      <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative w-[302px]">
        <Frame49 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#f5eff4] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame60162() {
  return (
    <div className="content-stretch flex gap-8 items-start justify-start overflow-clip relative shrink-0">
      <Primary8 />
      <Primary9 />
      <Primary10 />
      <Primary11 />
    </div>
  );
}

function Colors() {
  return (
    <div className="content-stretch flex flex-col gap-8 items-start justify-start overflow-clip relative shrink-0" data-name="colors">
      <Primary7 />
      <Frame60162 />
    </div>
  );
}

function BackgroundsAndContainers() {
  return (
    <div className="content-stretch flex flex-col gap-[60px] items-start justify-start relative shrink-0 w-full" data-name="Backgrounds and Containers">
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#050406] text-[30px]" style={{ width: "min-content" }}>
        <p className="leading-[36px]">Backgrounds and Containers</p>
      </div>
      <Colors />
    </div>
  );
}

function Success1() {
  return (
    <div className="content-stretch flex flex-col font-['Inter:Semi_Bold',_sans-serif] font-semibold gap-8 items-start justify-start leading-[0] not-italic overflow-clip relative shrink-0 text-[24px] text-nowrap" data-name="Success">
      <div className="relative shrink-0 text-[#050406]">
        <p className="leading-[32px] text-nowrap whitespace-pre">text/default</p>
      </div>
      <div className="relative shrink-0 text-[#47454a]">
        <p className="leading-[32px] text-nowrap whitespace-pre">text/secondary</p>
      </div>
      <div className="relative shrink-0 text-[#79757a]">
        <p className="leading-[32px] text-nowrap whitespace-pre">text/subtle</p>
      </div>
      <div className="relative shrink-0 text-[#bdb7bd]">
        <p className="leading-[32px] text-nowrap whitespace-pre">text/disabled</p>
      </div>
    </div>
  );
}

function Warning1() {
  return (
    <div className="content-stretch flex flex-col font-['Inter:Semi_Bold',_sans-serif] font-semibold gap-8 items-start justify-start leading-[0] not-italic overflow-clip relative shrink-0 text-[24px] text-nowrap" data-name="Warning">
      <div className="relative shrink-0 text-[#7134da]">
        <p className="leading-[32px] text-nowrap whitespace-pre">primary/default</p>
      </div>
      <div className="relative shrink-0 text-[#006c4c]">
        <p className="leading-[32px] text-nowrap whitespace-pre">success/default</p>
      </div>
      <div className="relative shrink-0 text-[#bb1b1b]">
        <p className="leading-[32px] text-nowrap whitespace-pre">danger/default</p>
      </div>
      <div className="relative shrink-0 text-[#6a5f00]">
        <p className="leading-[32px] text-nowrap whitespace-pre">warning/default</p>
      </div>
      <div className="relative shrink-0 text-[#005ac7]">
        <p className="leading-[32px] text-nowrap whitespace-pre">info/default</p>
      </div>
    </div>
  );
}

function Frame60164() {
  return (
    <div className="content-stretch flex gap-8 items-start justify-start overflow-clip relative shrink-0">
      <Success1 />
      <Warning1 />
    </div>
  );
}

function Text() {
  return (
    <div className="content-stretch flex flex-col gap-[60px] items-start justify-start relative shrink-0 w-full" data-name="Text">
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#050406] text-[30px]" style={{ width: "min-content" }}>
        <p className="leading-[36px]">Text</p>
      </div>
      <Frame60164 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="relative rounded-[8px] shrink-0">
      <div className="box-border content-stretch flex flex-col items-start justify-start overflow-clip p-[12px] relative">
        <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#050406] text-[16px] text-nowrap">
          <p className="leading-[24px] whitespace-pre">stroke/default</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d9d4d9] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame11() {
  return (
    <div className="relative rounded-[8px] shrink-0">
      <div className="box-border content-stretch flex flex-col items-start justify-start overflow-clip p-[12px] relative">
        <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#050406] text-[16px] text-nowrap">
          <p className="leading-[24px] whitespace-pre">stroke/strong</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#bdb7bd] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame13() {
  return (
    <div className="relative rounded-[8px] shrink-0">
      <div className="box-border content-stretch flex flex-col items-start justify-start overflow-clip p-[12px] relative">
        <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#050406] text-[16px] text-nowrap">
          <p className="leading-[24px] whitespace-pre">stroke/subtle</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e0e5] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame12() {
  return (
    <div className="relative rounded-[8px] shrink-0">
      <div className="box-border content-stretch flex flex-col items-start justify-start overflow-clip p-[12px] relative">
        <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#050406] text-[16px] text-nowrap">
          <p className="leading-[24px] whitespace-pre">stroke/disabled</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#f5eff4] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex gap-3 items-start justify-start relative shrink-0">
      <Frame10 />
      <Frame11 />
      <Frame13 />
      <Frame12 />
    </div>
  );
}

function Frame50() {
  return (
    <div className="relative rounded-[8px] shrink-0">
      <div className="box-border content-stretch flex flex-col items-start justify-start overflow-clip p-[12px] relative">
        <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#7134da] text-[16px] text-nowrap">
          <p className="leading-[24px] whitespace-pre">primary/stroke</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#a175ff] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame51() {
  return (
    <div className="relative rounded-[8px] shrink-0">
      <div className="box-border content-stretch flex flex-col items-start justify-start overflow-clip p-[12px] relative">
        <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#006c4c] text-[16px] text-nowrap">
          <p className="leading-[24px] whitespace-pre">success/stroke</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#00a575] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame52() {
  return (
    <div className="relative rounded-[8px] shrink-0">
      <div className="box-border content-stretch flex flex-col items-start justify-start overflow-clip p-[12px] relative">
        <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#6a5f00] text-[16px] text-nowrap">
          <p className="leading-[24px] whitespace-pre">warning/stroke</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#a39100] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame53() {
  return (
    <div className="relative rounded-[8px] shrink-0">
      <div className="box-border content-stretch flex flex-col items-start justify-start overflow-clip p-[12px] relative">
        <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#bb1b1b] text-[16px] text-nowrap">
          <p className="leading-[24px] whitespace-pre">danger/stroke</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#ff5447] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame54() {
  return (
    <div className="relative rounded-[8px] shrink-0">
      <div className="box-border content-stretch flex flex-col items-start justify-start overflow-clip p-[12px] relative">
        <div className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[#005ac7] text-[16px] text-nowrap">
          <p className="leading-[24px] whitespace-pre">info/stroke</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#528bff] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex gap-3 items-start justify-start relative shrink-0">
      <Frame50 />
      <Frame51 />
      <Frame52 />
      <Frame53 />
      <Frame54 />
    </div>
  );
}

function Colors1() {
  return (
    <div className="content-stretch flex flex-col gap-8 items-start justify-start overflow-clip relative shrink-0" data-name="colors">
      <Frame14 />
      <Frame15 />
    </div>
  );
}

function Stroke() {
  return (
    <div className="content-stretch flex flex-col gap-[60px] items-start justify-start relative shrink-0 w-full" data-name="Stroke">
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#050406] text-[30px]" style={{ width: "min-content" }}>
        <p className="leading-[36px]">Stroke</p>
      </div>
      <Colors1 />
    </div>
  );
}

function InteractivePrimaryFocus() {
  return (
    <div className="bg-[#fdf7fd] h-[72px] relative rounded-[6px] shrink-0 w-[204px]" data-name="Interactive/primary-focus">
      <div aria-hidden="true" className="absolute border border-[#a175ff] border-solid inset-0 pointer-events-none rounded-[6px] shadow-[0px_0px_0px_3px_#f5ebff]" />
    </div>
  );
}

function PrimaryFocus() {
  return (
    <div className="content-stretch flex flex-col gap-3 items-start justify-start relative shrink-0" data-name="primary focus">
      <InteractivePrimaryFocus />
      <div className="flex flex-col font-['Inter:Semi_Bold',_sans-serif] font-semibold justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#050406] text-[16px]" style={{ width: "min-content" }}>
        <p className="leading-[24px]">primary-focus</p>
      </div>
    </div>
  );
}

function InteractivePrimaryFocus1() {
  return (
    <div className="bg-[#fdf7fd] h-[72px] relative rounded-[6px] shrink-0 w-[204px]" data-name="Interactive/primary-focus">
      <div aria-hidden="true" className="absolute border border-[#ff5447] border-solid inset-0 pointer-events-none rounded-[6px] shadow-[0px_0px_0px_3px_#ffeeeb]" />
    </div>
  );
}

function DangerFocus() {
  return (
    <div className="content-stretch flex flex-col gap-3 items-start justify-start relative shrink-0" data-name="danger focus">
      <InteractivePrimaryFocus1 />
      <div className="flex flex-col font-['Inter:Semi_Bold',_sans-serif] font-semibold justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#050406] text-[16px]" style={{ width: "min-content" }}>
        <p className="leading-[24px]">danger-focus</p>
      </div>
    </div>
  );
}

function InteractivePrimaryFocus2() {
  return (
    <div className="bg-[#fdf7fd] h-[72px] relative rounded-[6px] shrink-0 w-[204px]" data-name="Interactive/primary-focus">
      <div aria-hidden="true" className="absolute border border-[#bdb7bd] border-solid inset-0 pointer-events-none rounded-[6px] shadow-[0px_0px_0px_3px_#f5eff4]" />
    </div>
  );
}

function NeutralFocus() {
  return (
    <div className="content-stretch flex flex-col gap-3 items-start justify-start relative shrink-0" data-name="neutral focus">
      <InteractivePrimaryFocus2 />
      <div className="flex flex-col font-['Inter:Semi_Bold',_sans-serif] font-semibold justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#050406] text-[16px]" style={{ width: "min-content" }}>
        <p className="leading-[24px]">neutral-focus</p>
      </div>
    </div>
  );
}

function Frame55() {
  return (
    <div className="content-stretch flex gap-8 items-start justify-start relative shrink-0">
      <PrimaryFocus />
      <DangerFocus />
      <NeutralFocus />
    </div>
  );
}

function Colors2() {
  return (
    <div className="content-stretch flex flex-col gap-8 items-start justify-start relative shrink-0" data-name="colors">
      <Frame55 />
    </div>
  );
}

function Focus() {
  return (
    <div className="content-stretch flex flex-col gap-[60px] items-start justify-start relative shrink-0 w-full" data-name="Focus">
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#050406] text-[30px]" style={{ width: "min-content" }}>
        <p className="leading-[36px]">Focus</p>
      </div>
      <Colors2 />
    </div>
  );
}

export default function InterfaceThemeColorStylesLightMode() {
  return (
    <div className="bg-white relative size-full" data-name="Interface Theme: Color Styles (Light Mode)">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-[60px] items-start justify-start px-[60px] py-20 relative size-full">
          <Title />
          <div className="h-0 relative shrink-0 w-full" data-name="HR">
            <div className="absolute bottom-0 left-0 right-0 top-[-2px]" style={{ "--stroke-0": "rgba(229, 224, 229, 1)" } as React.CSSProperties}>
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1798 2">
                <line id="HR" stroke="var(--stroke-0, #E5E0E5)" strokeWidth="2" x2="1798" y1="1" y2="1" />
              </svg>
            </div>
          </div>
          <Primary1 />
          <div className="h-0 relative shrink-0 w-full" data-name="HR">
            <div className="absolute bottom-0 left-0 right-0 top-[-2px]" style={{ "--stroke-0": "rgba(229, 224, 229, 1)" } as React.CSSProperties}>
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1798 2">
                <line id="HR" stroke="var(--stroke-0, #E5E0E5)" strokeWidth="2" x2="1798" y1="1" y2="1" />
              </svg>
            </div>
          </div>
          <Feedback />
          <div className="h-0 relative shrink-0 w-full" data-name="HR">
            <div className="absolute bottom-0 left-0 right-0 top-[-2px]" style={{ "--stroke-0": "rgba(229, 224, 229, 1)" } as React.CSSProperties}>
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1798 2">
                <line id="HR" stroke="var(--stroke-0, #E5E0E5)" strokeWidth="2" x2="1798" y1="1" y2="1" />
              </svg>
            </div>
          </div>
          <BackgroundsAndContainers />
          <div className="h-0 relative shrink-0 w-full" data-name="HR">
            <div className="absolute bottom-0 left-0 right-0 top-[-2px]" style={{ "--stroke-0": "rgba(229, 224, 229, 1)" } as React.CSSProperties}>
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1798 2">
                <line id="HR" stroke="var(--stroke-0, #E5E0E5)" strokeWidth="2" x2="1798" y1="1" y2="1" />
              </svg>
            </div>
          </div>
          <Text />
          <div className="h-0 relative shrink-0 w-full" data-name="HR">
            <div className="absolute bottom-0 left-0 right-0 top-[-2px]" style={{ "--stroke-0": "rgba(229, 224, 229, 1)" } as React.CSSProperties}>
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1798 2">
                <line id="HR" stroke="var(--stroke-0, #E5E0E5)" strokeWidth="2" x2="1798" y1="1" y2="1" />
              </svg>
            </div>
          </div>
          <Stroke />
          <div className="h-0 relative shrink-0 w-full" data-name="HR">
            <div className="absolute bottom-0 left-0 right-0 top-[-2px]" style={{ "--stroke-0": "rgba(229, 224, 229, 1)" } as React.CSSProperties}>
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1798 2">
                <line id="HR" stroke="var(--stroke-0, #E5E0E5)" strokeWidth="2" x2="1798" y1="1" y2="1" />
              </svg>
            </div>
          </div>
          <Focus />
        </div>
      </div>
    </div>
  );
}