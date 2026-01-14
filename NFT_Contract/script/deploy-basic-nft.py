from src import basic_nft

NFT_URI = "QmTGwitAFiLAkhhEJuRmRrCd63HyjVCRUunidnrXsKhDif"

def deploy_basic_nft():
    contract = basic_nft.deploy()
    contract.mint(NFT_URI)

def moccasin_main():
    deploy_basic_nft()